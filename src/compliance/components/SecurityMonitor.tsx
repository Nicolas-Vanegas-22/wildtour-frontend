import { useEffect, useRef } from 'react';
import { useAuditLogger } from '../hooks/useAuditLogger';
import { useAuthStore } from '../../application/state/useAuthStore';

interface SecurityMetrics {
  clickCount: number;
  keystrokes: number;
  mouseMovements: number;
  focusChanges: number;
  lastActivity: number;
  suspiciousPatterns: string[];
}

export function SecurityMonitor() {
  const auditLogger = useAuditLogger();
  const { user } = useAuthStore();
  const metricsRef = useRef<SecurityMetrics>({
    clickCount: 0,
    keystrokes: 0,
    mouseMovements: 0,
    focusChanges: 0,
    lastActivity: Date.now(),
    suspiciousPatterns: [],
  });

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    let rapidClickTimer: NodeJS.Timeout;
    let rapidClickCount = 0;

    // Detectar clics rápidos (posible bot)
    const handleClick = (event: MouseEvent) => {
      const metrics = metricsRef.current;
      metrics.clickCount++;
      metrics.lastActivity = Date.now();

      rapidClickCount++;

      // Resetear contador después de 1 segundo
      clearTimeout(rapidClickTimer);
      rapidClickTimer = setTimeout(() => {
        rapidClickCount = 0;
      }, 1000);

      // Detectar clics sospechosamente rápidos
      if (rapidClickCount > 10) {
        metrics.suspiciousPatterns.push('rapid_clicking');
        auditLogger.logSecurityEvent({
          description: 'Suspicious rapid clicking detected',
          severity: 'medium',
          details: {
            clicksPerSecond: rapidClickCount,
            target: (event.target as Element)?.tagName || 'unknown',
            timestamp: new Date().toISOString(),
          },
        });
      }

      // Detectar clics en elementos ocultos (posible manipulación DOM)
      const target = event.target as HTMLElement;
      if (target && (
        target.style.display === 'none' ||
        target.style.visibility === 'hidden' ||
        target.offsetParent === null
      )) {
        metrics.suspiciousPatterns.push('hidden_element_click');
        auditLogger.logSecurityEvent({
          description: 'Click on hidden element detected',
          severity: 'high',
          details: {
            elementTag: target.tagName,
            elementId: target.id,
            elementClass: target.className,
            computedStyle: {
              display: target.style.display,
              visibility: target.style.visibility,
              opacity: target.style.opacity,
            },
            timestamp: new Date().toISOString(),
          },
        });
      }
    };

    // Detectar patrones de tecleo sospechosos
    const handleKeyDown = (event: KeyboardEvent) => {
      const metrics = metricsRef.current;
      metrics.keystrokes++;
      metrics.lastActivity = Date.now();

      // Detectar combinaciones de teclas peligrosas
      const dangerousKeyCombos = [
        { ctrl: true, shift: true, key: 'I' }, // DevTools
        { ctrl: true, shift: true, key: 'J' }, // Console
        { ctrl: true, shift: true, key: 'C' }, // DevTools
        { key: 'F12' }, // DevTools
      ];

      const isDangerous = dangerousKeyCombos.some(combo => {
        return (!combo.ctrl || event.ctrlKey) &&
               (!combo.shift || event.shiftKey) &&
               event.key === combo.key;
      });

      if (isDangerous) {
        metrics.suspiciousPatterns.push('devtools_attempt');
        auditLogger.logSecurityEvent({
          description: 'Potential DevTools access attempt',
          severity: 'medium',
          details: {
            key: event.key,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            timestamp: new Date().toISOString(),
          },
        });
      }

      // Detectar secuencias de teclas automatizadas
      if (metrics.keystrokes > 0 && (Date.now() - metrics.lastActivity) < 10) {
        // Tecleo muy rápido, posiblemente automatizado
        const recentKeystrokes = metrics.keystrokes % 50; // Cada 50 teclas
        if (recentKeystrokes === 0) {
          metrics.suspiciousPatterns.push('automated_typing');
          auditLogger.logSecurityEvent({
            description: 'Automated typing pattern detected',
            severity: 'medium',
            details: {
              keystrokesPerPeriod: 50,
              averageInterval: 10,
              timestamp: new Date().toISOString(),
            },
          });
        }
      }
    };

    // Detectar movimientos de mouse no naturales
    let lastMousePosition = { x: 0, y: 0 };
    let lastMouseTime = Date.now();

    const handleMouseMove = (event: MouseEvent) => {
      const metrics = metricsRef.current;
      metrics.mouseMovements++;
      metrics.lastActivity = Date.now();

      const currentTime = Date.now();
      const timeDiff = currentTime - lastMouseTime;
      const distance = Math.sqrt(
        Math.pow(event.clientX - lastMousePosition.x, 2) +
        Math.pow(event.clientY - lastMousePosition.y, 2)
      );

      // Detectar movimientos muy lineales (posible automatización)
      if (timeDiff > 0 && distance > 0) {
        const speed = distance / timeDiff;

        if (speed > 5 && timeDiff < 16) { // Muy rápido y preciso
          metrics.suspiciousPatterns.push('automated_mouse');
          auditLogger.logSecurityEvent({
            description: 'Suspicious mouse movement pattern',
            severity: 'low',
            details: {
              speed,
              distance,
              timeDiff,
              coordinates: { x: event.clientX, y: event.clientY },
              timestamp: new Date().toISOString(),
            },
          });
        }
      }

      lastMousePosition = { x: event.clientX, y: event.clientY };
      lastMouseTime = currentTime;
    };

    // Detectar cambios de foco sospechosos
    const handleFocusChange = () => {
      const metrics = metricsRef.current;
      metrics.focusChanges++;
      metrics.lastActivity = Date.now();

      // Detectar pérdida/recuperación de foco muy frecuente
      if (metrics.focusChanges > 20) {
        metrics.suspiciousPatterns.push('excessive_focus_changes');
        auditLogger.logSecurityEvent({
          description: 'Excessive focus changes detected',
          severity: 'medium',
          details: {
            focusChanges: metrics.focusChanges,
            timestamp: new Date().toISOString(),
          },
        });
      }
    };

    // Detectar inactividad prolongada
    const checkInactivity = () => {
      const metrics = metricsRef.current;
      const inactivityTime = Date.now() - metrics.lastActivity;

      if (inactivityTime > 30 * 60 * 1000) { // 30 minutos
        auditLogger.logSecurityEvent({
          description: 'Extended user inactivity detected',
          severity: 'low',
          details: {
            inactivityMinutes: Math.floor(inactivityTime / 60000),
            timestamp: new Date().toISOString(),
          },
        });

        // Resetear métricas
        metricsRef.current = {
          clickCount: 0,
          keystrokes: 0,
          mouseMovements: 0,
          focusChanges: 0,
          lastActivity: Date.now(),
          suspiciousPatterns: [],
        };
      }
    };

    // Detectar manipulación del DOM
    const observeDOM = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Detectar inyección de scripts
          const addedNodes = Array.from(mutation.addedNodes);
          const scripts = addedNodes.filter(node =>
            node.nodeName === 'SCRIPT' ||
            (node as Element).tagName === 'SCRIPT'
          );

          if (scripts.length > 0) {
            auditLogger.logSecurityEvent({
              description: 'Script injection detected',
              severity: 'critical',
              details: {
                scriptCount: scripts.length,
                targetElement: mutation.target.nodeName,
                timestamp: new Date().toISOString(),
              },
            });
          }

          // Detectar formularios inyectados
          const forms = addedNodes.filter(node =>
            node.nodeName === 'FORM' ||
            (node as Element).tagName === 'FORM'
          );

          if (forms.length > 0) {
            auditLogger.logSecurityEvent({
              description: 'Form injection detected',
              severity: 'high',
              details: {
                formCount: forms.length,
                targetElement: mutation.target.nodeName,
                timestamp: new Date().toISOString(),
              },
            });
          }
        }

        // Detectar modificación de atributos sensibles
        if (mutation.type === 'attributes') {
          const sensitiveAttributes = ['action', 'src', 'href', 'onclick'];
          if (sensitiveAttributes.includes(mutation.attributeName || '')) {
            auditLogger.logSecurityEvent({
              description: `Sensitive attribute modified: ${mutation.attributeName}`,
              severity: 'medium',
              details: {
                attribute: mutation.attributeName,
                element: mutation.target.nodeName,
                timestamp: new Date().toISOString(),
              },
            });
          }
        }
      });
    });

    // Configurar event listeners
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('focus', handleFocusChange);
    window.addEventListener('blur', handleFocusChange);

    // Configurar observer
    observeDOM.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['action', 'src', 'href', 'onclick'],
    });

    // Configurar timer de inactividad
    inactivityTimer = setInterval(checkInactivity, 60000); // Cada minuto

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('focus', handleFocusChange);
      window.removeEventListener('blur', handleFocusChange);
      observeDOM.disconnect();
      clearInterval(inactivityTimer);
      clearTimeout(rapidClickTimer);
    };
  }, [auditLogger]);

  // Enviar resumen de métricas periódicamente
  useEffect(() => {
    const sendMetricsSummary = () => {
      const metrics = metricsRef.current;

      if (metrics.suspiciousPatterns.length > 0) {
        auditLogger.logSecurityEvent({
          description: 'Security metrics summary',
          severity: 'medium',
          details: {
            totalClicks: metrics.clickCount,
            totalKeystrokes: metrics.keystrokes,
            totalMouseMovements: metrics.mouseMovements,
            totalFocusChanges: metrics.focusChanges,
            suspiciousPatterns: metrics.suspiciousPatterns,
            sessionDuration: Date.now() - (metrics.lastActivity - 300000), // Aproximado
            timestamp: new Date().toISOString(),
          },
        });

        // Limpiar patrones sospechosos después del reporte
        metrics.suspiciousPatterns = [];
      }
    };

    // Enviar métricas cada 5 minutos
    const metricsInterval = setInterval(sendMetricsSummary, 5 * 60 * 1000);

    return () => clearInterval(metricsInterval);
  }, [auditLogger]);

  // Este componente no renderiza nada
  return null;
}