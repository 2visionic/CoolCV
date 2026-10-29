import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DEFAULT_PORTRAIT_SVG, UI_TEXT } from './i18n/translations';
import Icon from './components/Icon';
import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import ServicesPillars from './components/ServicesPillars';
import StructuredResume from './components/StructuredResume';
import FeaturedProjects from './components/FeaturedProjects';
import Backoffice from './components/Backoffice';
import type {
  ThemeMode,
  LangCode,
  ViewMode,
  RoleFilter,
  CvDataPayload,
  ProfileData,
  RolePillar,
  AuthUser,
  BackendCryptoReport,
  ApiLogEntry,
  ApiCallResult,
} from './types/cv';

let toastTimer: any = null;

// Main React 18 root componet connecting Frontend Web CV and Backoffice admin
export default function App(): React.ReactElement {
  const initial = window.__INITIAL_STATE__ || {};
  const [theme, setTheme] = useState<ThemeMode>(initial.theme || 'dark');
  const [lang, setLang] = useState<LangCode>(initial.lang || 'cs');
  const [view, setView] = useState<ViewMode>(initial.initialView || 'cv');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(initial.initialView === 'backoffice');
  const [activeRole, setActiveRole] = useState<RoleFilter>('all');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [cvData, setCvData] = useState<CvDataPayload>(
    initial.cvData || {
      driver: 'loading',
      profile: {} as ProfileData,
      roles: [],
      skills: [],
      experience: [],
      projects: [],
      education: [],
      socials: [],
    }
  );

  const [jwtToken, setJwtToken] = useState<string>(() => localStorage.getItem('coolcv_jwt_token') || '');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [cryptoReport, setCryptoReport] = useState<BackendCryptoReport | null>(null);
  const [apiLogs, setApiLogs] = useState<ApiLogEntry[]>([]);
  const [toast, setToast] = useState<{ msg: string; isError: boolean } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [photoUploadProgress, setPhotoUploadProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isDark = theme === 'dark';
  const t = (key: string): string => {
    const normalizedKey =
      key === 'hello_im' ? 'hello' : key === 'pillars_title' ? 'services_title' : key;
    const customVal =
      cvData.profile?.[`ui_${normalizedKey}_${lang}`] ||
      cvData.profile?.[`ui_${normalizedKey}`] ||
      (normalizedKey.endsWith('_num') ? cvData.profile?.[`ui_${normalizedKey}_cs`] : '');
    if (typeof customVal === 'string' && customVal.trim() !== '') {
      return customVal;
    }
    return UI_TEXT[lang]?.[normalizedKey] || UI_TEXT.cs[normalizedKey] || normalizedKey;
  };
  const field = (row: any, base: string): string => {
    if (!row) return '';
    return row[`${base}_${lang}`] || row[`${base}_cs`] || row[base] || '';
  };

  function showToast(msg: string, isError: boolean = false) {
    setToast({ msg, isError });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(null), 3800);
  }

  async function callApi(
    route: string,
    method: string = 'GET',
    body: any = null,
    tokenOverride: string | null = null
  ): Promise<ApiCallResult> {
    const activeTok = tokenOverride !== null ? tokenOverride : jwtToken;
    const url = `api.php?route=${route}`;
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
    if (activeTok) {
      headers['Authorization'] = `Bearer ${activeTok}`;
      headers['X-Api-Token'] = activeTok;
    }
    const options: RequestInit = { method, headers, credentials: 'same-origin' };
    if (body !== null && method !== 'GET') {
      headers['Content-Type'] = 'application/json; charset=utf-8';
      headers['X-HTTP-Method-Override'] = method;
      options.body = JSON.stringify(body);
    }

    try {
      const res = await fetch(url, options);
      const json = await res.json();
      const entry: ApiLogEntry = {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        method,
        url,
        status: res.status,
        ms: json?.meta?.execution_ms ?? '-',
        response: json,
      };
      setApiLogs((prev) => [entry, ...prev.slice(0, 14)]);
      return { ok: res.ok && json.ok !== false, status: res.status, data: json };
    } catch (err: any) {
      return { ok: false, status: 500, data: { error: err?.message || 'Network error' } };
    }
  }

  useEffect(() => {
    (async () => {
      const cvRes = await callApi('cv', 'GET');
      if (cvRes.ok && cvRes.data?.data) {
        setCvData(cvRes.data.data);
      }
      if (jwtToken) {
        const meRes = await callApi('auth/me', 'GET', null, jwtToken);
        if (meRes.ok) {
          setAuthUser(meRes.data.user);
          setCryptoReport(meRes.data.backend_crypto);
        } else {
          setJwtToken('');
          localStorage.removeItem('coolcv_jwt_token');
        }
      }
    })();
  }, []);

  async function toggleTheme() {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      await fetch(`?theme=${next}&ajax=1`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    } catch (_) {}
  }

  async function toggleLang() {
    const next: LangCode = lang === 'cs' ? 'en' : 'cs';
    setLang(next);
    document.documentElement.setAttribute('lang', next);
    try {
      await fetch(`?lang=${next}&ajax=1`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    } catch (_) {}
  }

  async function ensureHtml2PdfLoaded() {
    if (typeof window.html2pdf === 'function') {
      return window.html2pdf;
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'assets/js/html2pdf.bundle.min.js';
      script.onload = () => {
        if (typeof window.html2pdf === 'function') {
          resolve(window.html2pdf);
        } else {
          reject(new Error('Knihovna pro PDF se nenačetla.'));
        }
      };
      script.onerror = () => reject(new Error('Nelze načíst knihovnu pro generování PDF.'));
      document.head.appendChild(script);
    });
  }

  async function loadMontserratPdfFontBase64() {
    try {
      const res = await fetch('assets/fonts/Montserrat-Regular.ttf');
      if (!res.ok) return '';
      const buf = await res.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = '';
      const chunk = 8192;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
      }
      return window.btoa(binary);
    } catch (_) {
      return '';
    }
  }

  function extractInteractiveLayer(idoc, pageEl) {
    if (!idoc || !pageEl) return { links: [], texts: [] };
    const pageRect = pageEl.getBoundingClientRect();
    const scaleX = 210 / (pageRect.width || 794);
    const scaleY = 297 / (pageRect.height || 1123);
    const links = [];
    const texts = [];

    const anchors = pageEl.querySelectorAll('a[href]');
    anchors.forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return;
      const r = a.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        links.push({
          url: href,
          x: Math.max(0, (r.left - pageRect.left) * scaleX - 1),
          y: Math.max(0, (r.top - pageRect.top) * scaleY - 1),
          w: r.width * scaleX + 2,
          h: r.height * scaleY + 2,
        });
      }
    });

    const walker = idoc.createTreeWalker(pageEl, 4);
    let node;
    while ((node = walker.nextNode())) {
      const raw = node.nodeValue || '';
      if (!raw.trim()) continue;
      const parentEl = node.parentElement;
      if (!parentEl) continue;
      if (parentEl.closest('.material-symbols-rounded, script, style, svg')) continue;

      const comp = idoc.defaultView ? idoc.defaultView.getComputedStyle(parentEl) : null;
      const fontSizePx = comp ? parseFloat(comp.fontSize) || 10 : 10;
      const fontSizePt = Math.max(5.5, Math.min(34, fontSizePx * 0.75));

      const tokenRegex = /\S+\s*/g;
      let match;
      let currentLine = null;

      while ((match = tokenRegex.exec(raw)) !== null) {
        const range = idoc.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const r = range.getBoundingClientRect();
        if (!r || r.width <= 0 || r.height <= 0) continue;

        if (!currentLine || Math.abs(r.top - currentLine.top) > 3.5) {
          if (currentLine && currentLine.text.trim()) {
            texts.push({
              text: currentLine.text.replace(/\s+/g, ' ').trim(),
              x: (currentLine.left - pageRect.left) * scaleX,
              y: (currentLine.bottom - pageRect.top - currentLine.height * 0.18) * scaleY,
              fontSizePt,
            });
          }
          currentLine = {
            text: match[0],
            top: r.top,
            left: r.left,
            bottom: r.bottom,
            height: r.height,
          };
        } else {
          currentLine.text += match[0];
          currentLine.bottom = Math.max(currentLine.bottom, r.bottom);
          currentLine.height = Math.max(currentLine.height, r.height);
        }
      }

      if (currentLine && currentLine.text.trim()) {
        texts.push({
          text: currentLine.text.replace(/\s+/g, ' ').trim(),
          x: (currentLine.left - pageRect.left) * scaleX,
          y: (currentLine.bottom - pageRect.top - currentLine.height * 0.18) * scaleY,
          fontSizePt,
        });
      }
    }

    return { links, texts };
  }

  function applyInteractiveLayerToPdfPage(pdf, layout, hasFont) {
    if (!pdf || !layout) return;
    if (hasFont && Array.isArray(layout.texts) && layout.texts.length > 0) {
      try {
        pdf.setFont('Montserrat', 'normal');
        pdf.internal.write('3 Tr');
        layout.texts.forEach((item) => {
          if (!item.text) return;
          pdf.setFontSize(item.fontSizePt);
          pdf.text(item.text, item.x, item.y);
        });
        pdf.internal.write('0 Tr');
      } catch (_) {}
    }
    if (Array.isArray(layout.links) && layout.links.length > 0) {
      layout.links.forEach((lnk) => {
        try {
          pdf.link(lnk.x, lnk.y, lnk.w, lnk.h, { url: lnk.url });
        } catch (_) {}
      });
    }
  }

  // Request PDF from backend/pdf_template.php with live dynamic cvData and directly download .pdf file
  async function handleDownloadPdf() {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const latestRes = await callApi('cv', 'GET');
      const liveCvData = latestRes.ok && latestRes.data?.data ? latestRes.data.data : cvData;
      if (latestRes.ok && latestRes.data?.data) {
        setCvData(latestRes.data.data);
      }

      const safeName = String(liveCvData.profile?.full_name || 'Jan-Novak')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const filename = `${safeName || 'CoolCV'}-CV-${lang.toUpperCase()}.pdf`;

      const res = await fetch(`api.php?route=cv/pdf&lang=${lang}&t=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          lang,
          cvData: liveCvData,
        }),
      });

      if (!res.ok) {
        let errMsg = 'Chyba při generování PDF na serveru.';
        try {
          const errJson = await res.json();
          if (errJson?.error) errMsg = errJson.error;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const contentType = (res.headers.get('content-type') || '').toLowerCase();

      if (contentType.includes('application/json')) {
        const json = await res.json();
        if (json?.html) {
          const html2pdfLib = await ensureHtml2PdfLoaded();
          const savedScrollY = window.scrollY || 0;
          window.scrollTo(0, 0);

          const iframe = document.createElement('iframe');
          iframe.style.position = 'fixed';
          iframe.style.left = '0';
          iframe.style.top = '0';
          iframe.style.width = '794px';
          iframe.style.height = '2300px';
          iframe.style.border = '0';
          iframe.style.opacity = '0.01';
          iframe.style.pointerEvents = 'none';
          iframe.style.zIndex = '9991';
          document.body.appendChild(iframe);

          try {
            const idoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!idoc || !iframe.contentWindow) {
              throw new Error('Nelze inicializovat PDF plátno.');
            }

            idoc.open();
            idoc.write(json.html);
            idoc.close();

            await new Promise((resolve) => {
              const s = idoc.createElement('script');
              s.src = 'assets/js/html2pdf.bundle.min.js';
              s.onload = () => resolve(true);
              s.onerror = () => resolve(false);
              idoc.head.appendChild(s);
            });

            await new Promise((resolve) => {
              let done = false;
              const finish = () => {
                if (!done) {
                  done = true;
                  resolve(true);
                }
              };
              if (idoc.readyState === 'complete') {
                setTimeout(finish, 600);
              } else {
                iframe.onload = () => setTimeout(finish, 600);
                setTimeout(finish, 1200);
              }
            });

            try {
              if (idoc.fonts && idoc.fonts.ready) {
                await idoc.fonts.ready;
              }
            } catch (_) {}

            await new Promise((r) => setTimeout(r, 400));

            const page1 = idoc.getElementById('pdf-page-1');
            const page2 = idoc.getElementById('pdf-page-2');
            if (!page1) {
              throw new Error('Šablona PDF nebyla nalezena.');
            }

            const hasPage2 = Boolean(page2 && page2.innerText && page2.innerText.trim().length > 0);
            const page1Layout = extractInteractiveLayer(idoc, page1);
            const page2Layout = hasPage2 ? extractInteractiveLayer(idoc, page2) : null;
            const fontB64 = await loadMontserratPdfFontBase64();

            const iframeH2p = (iframe.contentWindow && iframe.contentWindow['html2pdf']) || html2pdfLib;

            const worker1 = iframeH2p()
              .set({
                margin: 0,
                filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                  scale: 2.5,
                  useCORS: true,
                  allowTaint: true,
                  backgroundColor: '#ffffff',
                  width: 794,
                  height: 1123,
                  windowWidth: 794,
                  scrollX: 0,
                  scrollY: 0,
                },
                jsPDF: {
                  unit: 'mm',
                  format: 'a4',
                  orientation: 'portrait',
                  compress: true,
                },
              })
              .from(page1);

            const pdf = await worker1.toPdf().get('pdf');
            while (pdf.internal.getNumberOfPages() > 1) {
              pdf.deletePage(pdf.internal.getNumberOfPages());
            }

            let hasUnicodeFont = false;
            if (fontB64 && typeof pdf.addFileToVFS === 'function' && typeof pdf.addFont === 'function') {
              try {
                pdf.addFileToVFS('Montserrat-Regular.ttf', fontB64);
                pdf.addFont('Montserrat-Regular.ttf', 'Montserrat', 'normal', 'Identity-H');
                hasUnicodeFont = true;
              } catch (_) {}
            }

            pdf.setPage(1);
            applyInteractiveLayerToPdfPage(pdf, page1Layout, hasUnicodeFont);

            if (hasPage2 && page2) {
              page1.style.display = 'none';
              page2.classList.remove('page-break');
              page2.style.pageBreakBefore = 'auto';
              page2.style.breakBefore = 'auto';
              const canvas2 = await iframeH2p()
                .set({
                  margin: 0,
                  image: { type: 'jpeg', quality: 0.98 },
                  html2canvas: {
                    scale: 2.5,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    width: 794,
                    height: 1123,
                    windowWidth: 794,
                    scrollX: 0,
                    scrollY: 0,
                  },
                  jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: true,
                  },
                })
                .from(page2)
                .toCanvas()
                .get('canvas');

              const imgData2 = canvas2.toDataURL('image/jpeg', 0.98);
              pdf.addPage();
              pdf.setPage(2);
              pdf.addImage(imgData2, 'JPEG', 0, 0, 210, 297);
              applyInteractiveLayerToPdfPage(pdf, page2Layout, hasUnicodeFont);
            }

            const pdfBuffer = pdf.output('arraybuffer');
            const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
            const blobUrl = window.URL.createObjectURL(pdfBlob);
            const dlLink = document.createElement('a');
            dlLink.style.display = 'none';
            dlLink.href = blobUrl;
            dlLink.download = filename;
            document.body.appendChild(dlLink);
            dlLink.click();
            setTimeout(() => {
              if (dlLink.parentNode) {
                dlLink.parentNode.removeChild(dlLink);
              }
              window.URL.revokeObjectURL(blobUrl);
            }, 15000);
          } finally {
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
            window.scrollTo(0, savedScrollY);
          }

          showToast(
            lang === 'cs'
              ? `PDF životopis (${filename}) s aktuálními daty byl úspěšně stažen!`
              : `PDF resume (${filename}) with live data downloaded successfully!`
          );
          return;
        }
      }

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);

      showToast(
        lang === 'cs'
          ? `Vektorové PDF (${filename}) bylo úspěšně vygenerováno a staženo!`
          : `Vector PDF resume (${filename}) downloaded successfully!`
      );
    } catch (err: any) {
      showToast(err?.message || 'Chyba při generování PDF.', true);
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  function uploadPhotoWithProgress(compressedDataUrl, token, onProgress) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const url = 'api.php?route=profile/photo';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('X-Api-Token', token);
      }

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable && ev.total > 0) {
          const ratio = ev.loaded / ev.total;
          onProgress(Math.min(92, Math.round(35 + ratio * 57)));
        }
      };

      xhr.onload = () => {
        let json: any = {};
        try {
          json = JSON.parse(xhr.responseText || '{}');
        } catch (_) {}
        const entry: ApiLogEntry = {
          id: Date.now() + Math.random(),
          time: new Date().toLocaleTimeString(),
          method: 'POST',
          url,
          status: xhr.status,
          ms: json?.meta?.execution_ms ?? '-',
          response: json,
        };
        setApiLogs((prev) => [entry, ...prev.slice(0, 14)]);
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300 && json.ok !== false,
          status: xhr.status,
          data: json,
        });
      };

      xhr.onerror = () => {
        resolve({ ok: false, status: 500, data: { error: 'Network error' } });
      };

      xhr.send(JSON.stringify({ photo_data_url: compressedDataUrl }));
    });
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!jwtToken || !authUser) {
      setIsLoginModalOpen(true);
      showToast(
        lang === 'cs'
          ? 'Pro nahrání fotografie se nejprve přihlaste.'
          : 'Please sign in first.',
        true
      );
      return;
    }

    setIsUploadingPhoto(true);
    setPhotoUploadProgress(8);

    const reader = new FileReader();
    reader.onprogress = (ev) => {
      if (ev.lengthComputable && ev.total > 0) {
        const p = Math.round(8 + (ev.loaded / ev.total) * 18);
        setPhotoUploadProgress((prev) => Math.max(prev, p));
      }
    };
    reader.onload = (ev) => {
      const resultStr = typeof ev.target?.result === 'string' ? ev.target.result : '';
      if (!resultStr) {
        setIsUploadingPhoto(false);
        setPhotoUploadProgress(0);
        return;
      }

      setPhotoUploadProgress(28);
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const maxDim = 560;
        let w = img.width;
        let hDim = img.height;
        if (w > hDim && w > maxDim) {
          hDim = Math.round((hDim * maxDim) / w);
          w = maxDim;
        } else if (hDim >= w && hDim > maxDim) {
          w = Math.round((w * maxDim) / hDim);
          hDim = maxDim;
        }
        canvas.width = w;
        canvas.height = hDim;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, hDim);
        }
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setPhotoUploadProgress(38);

        // Smooth visual progress step alongside real XHR upload so circle progress animates cleanly
        const animTimer = setInterval(() => {
          setPhotoUploadProgress((prev) => (prev < 90 ? prev + 6 : prev));
        }, 70);

        const [upRes] = await Promise.all([
          uploadPhotoWithProgress(compressedDataUrl, jwtToken, (pct) => {
            setPhotoUploadProgress((prev) => Math.max(prev, pct));
          }),
          new Promise((r) => setTimeout(r, 650)),
        ]);

        clearInterval(animTimer);
        setPhotoUploadProgress(100);
        await new Promise((r) => setTimeout(r, 240));

        if (upRes.ok && upRes.data?.data) {
          setCvData((prev) => ({ ...prev, profile: upRes.data.data }));
          showToast(
            lang === 'cs'
              ? 'Profilová fotografie byla úspěšně nahrána přes REST API!'
              : 'Profile photo uploaded via REST API!'
          );
        } else {
          showToast(upRes.data?.error || 'Nahrání fotky selhalo.', true);
        }

        setIsUploadingPhoto(false);
        setPhotoUploadProgress(0);
      };
      img.onerror = () => {
        setIsUploadingPhoto(false);
        setPhotoUploadProgress(0);
        showToast('Nepodařilo se načíst vybraný obrázek.', true);
      };
      img.src = resultStr;
    };
    reader.readAsDataURL(file);
  }

  const profile: ProfileData = cvData.profile || ({} as ProfileData);
  const roles: RolePillar[] = cvData.roles || [];
  const roleMap = useMemo<Record<string, RolePillar>>(() => {
    const m: Record<string, RolePillar> = {};
    roles.forEach((r) => {
      m[r.slug] = r;
    });
    return m;
  }, [roles]);

  const filteredSkills = useMemo(() => {
    const list = cvData.skills || [];
    if (activeRole === 'all') return list;
    return list.filter((s) =>
      String(s.role_slug || '')
        .split(',')
        .map((x) => x.trim())
        .includes(activeRole)
    );
  }, [cvData.skills, activeRole]);

  const filteredExperience = useMemo(() => {
    const list = cvData.experience || [];
    if (activeRole === 'all') return list;
    return list.filter((item) =>
      String(item.role_tags || '')
        .split(',')
        .map((x) => x.trim())
        .includes(activeRole)
    );
  }, [cvData.experience, activeRole]);

  const filteredProjects = useMemo(() => {
    const list = cvData.projects || [];
    if (activeRole === 'all') return list;
    return list.filter((item) =>
      String(item.role_tags || '')
        .split(',')
        .map((x) => x.trim())
        .includes(activeRole)
    );
  }, [cvData.projects, activeRole]);

  const filteredEducation = useMemo(() => {
    const list = cvData.education || [];
    if (activeRole === 'all') return list;
    return list.filter((item) =>
      String(item.role_tags || '')
        .split(',')
        .map((x) => x.trim())
        .includes(activeRole)
    );
  }, [cvData.education, activeRole]);

  const fullName = profile.full_name || 'Jan Novák';
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || 'Jan';
  const lastName = nameParts.slice(1).join(' ') || 'Novák';
  const avatarSrc =
    profile.avatar_url && profile.avatar_url.length > 10 ? profile.avatar_url : DEFAULT_PORTRAIT_SVG;

  const pageBg = isDark ? 'bg-[#090a10] text-slate-100' : 'bg-[#f1f5f9] text-slate-900';
  const surfaceCard = isDark
    ? 'bg-[#121521] border border-white/[0.07] shadow-[0_20px_50px_rgba(0,0,0,0.45)]'
    : 'bg-white border border-slate-200 shadow-[0_12px_35px_rgba(15,23,42,0.06)]';
  const innerCard = isDark
    ? 'bg-[#181c2b] border border-white/[0.06] hover:border-purple-500/40 shadow-lg'
    : 'bg-slate-50/90 border border-slate-200 hover:border-purple-400 shadow-sm';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-600';
  const secondaryText = isDark ? 'text-slate-300' : 'text-slate-700';

  const showBackofficeFullPage = view === 'backoffice' && Boolean(authUser);
  const showLoginModal = !authUser && (isLoginModalOpen || view === 'backoffice');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg} pb-4 sm:pb-6 lg:pb-10 xl:p-10`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoSelect}
      />

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-sm shadow-2xl border transition-all ${
            toast.isError
              ? 'bg-rose-600 text-white border-rose-400'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/40'
          }`}
        >
          <Icon name={toast.isError ? 'error' : 'verified'} className="text-xl" />
          <span>{toast.msg}</span>
        </div>
      )}

      {showLoginModal && (
        <Backoffice
          cvData={cvData}
          setCvData={setCvData}
          jwtToken={jwtToken}
          setJwtToken={setJwtToken}
          authUser={authUser}
          setAuthUser={setAuthUser}
          cryptoReport={cryptoReport}
          setCryptoReport={setCryptoReport}
          callApi={callApi}
          showToast={showToast}
          apiLogs={apiLogs}
          onTriggerPhotoUpload={() => fileInputRef.current?.click()}
          isUploadingPhoto={isUploadingPhoto}
          photoUploadProgress={photoUploadProgress}
          onCloseModal={() => {
            setIsLoginModalOpen(false);
            setView('cv');
          }}
          onLoginSuccess={() => {
            setIsLoginModalOpen(false);
            setView('backoffice');
          }}
          avatarSrc={avatarSrc}
          surfaceCard={surfaceCard}
          innerCard={innerCard}
          mutedText={mutedText}
          secondaryText={secondaryText}
        />
      )}

      <div className="max-w-[1460px] mx-auto flex flex-col xl:flex-row gap-4 sm:gap-7 lg:gap-9 items-start">
        <Sidebar
          profile={profile}
          socials={cvData.socials || []}
          view={showBackofficeFullPage ? 'backoffice' : 'cv'}
          setView={setView}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onOpenBackoffice={() => {
            if (authUser) {
              setView('backoffice');
            } else {
              setIsLoginModalOpen(true);
            }
          }}
          isLoginModalOpen={showLoginModal}
          onDownloadPdf={handleDownloadPdf}
          isGeneratingPdf={isGeneratingPdf}
          lang={lang}
          toggleLang={toggleLang}
          isDark={isDark}
          toggleTheme={toggleTheme}
          t={t}
          surfaceCard={surfaceCard}
          innerCard={innerCard}
          mutedText={mutedText}
          secondaryText={secondaryText}
        />

        <div className="flex-1 min-w-0 w-full px-3 sm:px-6 lg:px-10 xl:px-0">
          <main
            className={`w-full rounded-3xl p-6 sm:p-10 lg:p-14 print-sheet transition-all ${surfaceCard}`}
          >
          {showBackofficeFullPage ? (
            <Backoffice
              cvData={cvData}
              setCvData={setCvData}
              jwtToken={jwtToken}
              setJwtToken={setJwtToken}
              authUser={authUser}
              setAuthUser={setAuthUser}
              cryptoReport={cryptoReport}
              setCryptoReport={setCryptoReport}
              callApi={callApi}
              showToast={showToast}
              apiLogs={apiLogs}
              onTriggerPhotoUpload={() => fileInputRef.current?.click()}
              isUploadingPhoto={isUploadingPhoto}
              photoUploadProgress={photoUploadProgress}
              onCloseModal={() => {
                setIsLoginModalOpen(false);
                setView('cv');
              }}
              onLoginSuccess={() => {
                setIsLoginModalOpen(false);
                setView('backoffice');
              }}
              avatarSrc={avatarSrc}
              surfaceCard={surfaceCard}
              innerCard={innerCard}
              mutedText={mutedText}
              secondaryText={secondaryText}
            />
          ) : (
            <div className="space-y-16 lg:space-y-20">
              <HeroSection
                firstName={firstName}
                lastName={lastName}
                fullName={fullName}
                profile={profile}
                avatarSrc={avatarSrc}
                isUploadingPhoto={isUploadingPhoto}
                photoUploadProgress={photoUploadProgress}
                field={field}
                t={t}
                isDark={isDark}
                surfaceCard={surfaceCard}
                innerCard={innerCard}
                mutedText={mutedText}
                secondaryText={secondaryText}
              />

              <ServicesPillars
                roles={roles}
                activeRole={activeRole}
                setActiveRole={setActiveRole}
                field={field}
                t={t}
                isDark={isDark}
                innerCard={innerCard}
                mutedText={mutedText}
                secondaryText={secondaryText}
              />

              <StructuredResume
                profile={profile}
                roles={roles}
                roleMap={roleMap}
                activeRole={activeRole}
                setActiveRole={setActiveRole}
                filteredExperience={filteredExperience}
                filteredEducation={filteredEducation}
                filteredSkills={filteredSkills}
                field={field}
                t={t}
                isDark={isDark}
                innerCard={innerCard}
                mutedText={mutedText}
                secondaryText={secondaryText}
              />

              <FeaturedProjects
                filteredProjects={filteredProjects}
                profile={profile}
                roles={roles}
                roleMap={roleMap}
                activeRole={activeRole}
                setActiveRole={setActiveRole}
                field={field}
                t={t}
                isDark={isDark}
                innerCard={innerCard}
                mutedText={mutedText}
                secondaryText={secondaryText}
              />
            </div>
          )}
          </main>
        </div>
      </div>

      {isGeneratingPdf && (
        <div className="fixed inset-0 z-[9995] bg-[#090a10]/90 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-white">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-2xl">
            <Icon name="picture_as_pdf" className="text-3xl animate-pulse" />
          </div>
          <div className="text-base font-extrabold tracking-tight">
            {lang === 'cs'
              ? 'Generuji vektorové PDF životopisu...'
              : 'Generating vector PDF resume...'}
          </div>
        </div>
      )}
    </div>
  );
}
