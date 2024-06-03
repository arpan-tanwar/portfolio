(() => {
  var g,
    P,
    ie,
    A,
    N,
    L = function () {
      return (
        window.performance &&
        performance.getEntriesByType &&
        performance.getEntriesByType("navigation")[0]
      );
    },
    B = function (t) {
      if (document.readyState === "loading") return "loading";
      var e = L();
      if (e) {
        if (t < e.domInteractive) return "loading";
        if (
          e.domContentLoadedEventStart === 0 ||
          t < e.domContentLoadedEventStart
        )
          return "dom-interactive";
        if (e.domComplete === 0 || t < e.domComplete)
          return "dom-content-loaded";
      }
      return "complete";
    },
    ye = function (t) {
      var e = t.nodeName;
      return t.nodeType === 1
        ? e.toLowerCase()
        : e.toUpperCase().replace(/^#/, "");
    },
    k = function (t, e) {
      var i = "";
      try {
        for (; t && t.nodeType !== 9; ) {
          var n = t,
            r = n.id
              ? "#" + n.id
              : ye(n) +
                (n.classList &&
                n.classList.value &&
                n.classList.value.trim() &&
                n.classList.value.trim().length
                  ? "." + n.classList.value.trim().replace(/\s+/g, ".")
                  : "");
          if (i.length + r.length > (e || 100) - 1) return i || r;
          if (((i = i ? r + ">" + i : r), n.id)) break;
          t = n.parentNode;
        }
      } catch {}
      return i;
    },
    ae = -1,
    oe = function () {
      return ae;
    },
    y = function (t) {
      addEventListener(
        "pageshow",
        function (e) {
          e.persisted && ((ae = e.timeStamp), t(e));
        },
        !0
      );
    },
    b = function () {
      var t = L();
      return (t && t.activationStart) || 0;
    },
    m = function (t, e) {
      var i = L(),
        n = "navigate";
      return (
        oe() >= 0
          ? (n = "back-forward-cache")
          : i &&
            (document.prerendering || b() > 0
              ? (n = "prerender")
              : document.wasDiscarded
              ? (n = "restore")
              : i.type && (n = i.type.replace(/_/g, "-"))),
        {
          name: t,
          value: e === void 0 ? -1 : e,
          rating: "good",
          delta: 0,
          entries: [],
          id: "v3-"
            .concat(Date.now(), "-")
            .concat(Math.floor(8999999999999 * Math.random()) + 1e12),
          navigationType: n,
        }
      );
    },
    C = function (t, e, i) {
      try {
        if (PerformanceObserver.supportedEntryTypes.includes(t)) {
          var n = new PerformanceObserver(function (r) {
            Promise.resolve().then(function () {
              e(r.getEntries());
            });
          });
          return (
            n.observe(Object.assign({ type: t, buffered: !0 }, i || {})), n
          );
        }
      } catch {}
    },
    p = function (t, e, i, n) {
      var r, o;
      return function (a) {
        e.value >= 0 &&
          (a || n) &&
          ((o = e.value - (r || 0)) || r === void 0) &&
          ((r = e.value),
          (e.delta = o),
          (e.rating = (function (c, s) {
            return c > s[1] ? "poor" : c > s[0] ? "needs-improvement" : "good";
          })(e.value, i)),
          t(e));
      };
    },
    H = function (t) {
      requestAnimationFrame(function () {
        return requestAnimationFrame(function () {
          return t();
        });
      });
    },
    _ = function (t) {
      var e = function (i) {
        (i.type !== "pagehide" && document.visibilityState !== "hidden") ||
          t(i);
      };
      addEventListener("visibilitychange", e, !0),
        addEventListener("pagehide", e, !0);
    },
    U = function (t) {
      var e = !1;
      return function (i) {
        e || (t(i), (e = !0));
      };
    },
    E = -1,
    Q = function () {
      return document.visibilityState !== "hidden" || document.prerendering
        ? 1 / 0
        : 0;
    },
    R = function (t) {
      document.visibilityState === "hidden" &&
        E > -1 &&
        ((E = t.type === "visibilitychange" ? t.timeStamp : 0), Se());
    },
    Z = function () {
      addEventListener("visibilitychange", R, !0),
        addEventListener("prerenderingchange", R, !0);
    },
    Se = function () {
      removeEventListener("visibilitychange", R, !0),
        removeEventListener("prerenderingchange", R, !0);
    },
    G = function () {
      return (
        E < 0 &&
          ((E = Q()),
          Z(),
          y(function () {
            setTimeout(function () {
              (E = Q()), Z();
            }, 0);
          })),
        {
          get firstHiddenTime() {
            return E;
          },
        }
      );
    },
    D = function (t) {
      document.prerendering
        ? addEventListener(
            "prerenderingchange",
            function () {
              return t();
            },
            !0
          )
        : t();
    },
    W = [1800, 3e3],
    ce = function (t, e) {
      (e = e || {}),
        D(function () {
          var i,
            n = G(),
            r = m("FCP"),
            o = C("paint", function (a) {
              a.forEach(function (c) {
                c.name === "first-contentful-paint" &&
                  (o.disconnect(),
                  c.startTime < n.firstHiddenTime &&
                    ((r.value = Math.max(c.startTime - b(), 0)),
                    r.entries.push(c),
                    i(!0)));
              });
            });
          o &&
            ((i = p(t, r, W, e.reportAllChanges)),
            y(function (a) {
              (r = m("FCP")),
                (i = p(t, r, W, e.reportAllChanges)),
                H(function () {
                  (r.value = performance.now() - a.timeStamp), i(!0);
                });
            }));
        });
    },
    K = [0.1, 0.25],
    se = function (t, e) {
      (function (i, n) {
        (n = n || {}),
          ce(
            U(function () {
              var r,
                o = m("CLS", 0),
                a = 0,
                c = [],
                s = function (f) {
                  f.forEach(function (u) {
                    if (!u.hadRecentInput) {
                      var h = c[0],
                        F = c[c.length - 1];
                      a &&
                      u.startTime - F.startTime < 1e3 &&
                      u.startTime - h.startTime < 5e3
                        ? ((a += u.value), c.push(u))
                        : ((a = u.value), (c = [u]));
                    }
                  }),
                    a > o.value && ((o.value = a), (o.entries = c), r());
                },
                l = C("layout-shift", s);
              l &&
                ((r = p(i, o, K, n.reportAllChanges)),
                _(function () {
                  s(l.takeRecords()), r(!0);
                }),
                y(function () {
                  (a = 0),
                    (o = m("CLS", 0)),
                    (r = p(i, o, K, n.reportAllChanges)),
                    H(function () {
                      return r();
                    });
                }),
                setTimeout(r, 0));
            })
          );
      })(function (i) {
        (function (n) {
          if (n.entries.length) {
            var r = n.entries.reduce(function (c, s) {
              return c && c.value > s.value ? c : s;
            });
            if (r && r.sources && r.sources.length) {
              var o =
                (a = r.sources).find(function (c) {
                  return c.node && c.node.nodeType === 1;
                }) || a[0];
              if (o)
                return void (n.attribution = {
                  largestShiftTarget: k(o.node),
                  largestShiftTime: r.startTime,
                  largestShiftValue: r.value,
                  largestShiftSource: o,
                  largestShiftEntry: r,
                  loadState: B(r.startTime),
                });
            }
          }
          var a;
          n.attribution = {};
        })(i),
          t(i);
      }, e);
    },
    de = function (t, e) {
      ce(function (i) {
        (function (n) {
          if (n.entries.length) {
            var r = L(),
              o = n.entries[n.entries.length - 1];
            if (r) {
              var a = r.activationStart || 0,
                c = Math.max(0, r.responseStart - a);
              return void (n.attribution = {
                timeToFirstByte: c,
                firstByteToFCP: n.value - c,
                loadState: B(n.entries[0].startTime),
                navigationEntry: r,
                fcpEntry: o,
              });
            }
          }
          n.attribution = {
            timeToFirstByte: 0,
            firstByteToFCP: n.value,
            loadState: B(oe()),
          };
        })(i),
          t(i);
      }, e);
    },
    I = { passive: !0, capture: !0 },
    Ee = new Date(),
    X = function (t, e) {
      g || ((g = e), (P = t), (ie = new Date()), le(removeEventListener), ue());
    },
    ue = function () {
      if (P >= 0 && P < ie - Ee) {
        var t = {
          entryType: "first-input",
          name: g.type,
          target: g.target,
          cancelable: g.cancelable,
          startTime: g.timeStamp,
          processingStart: g.timeStamp + P,
        };
        A.forEach(function (e) {
          e(t);
        }),
          (A = []);
      }
    },
    Le = function (t) {
      if (t.cancelable) {
        var e =
          (t.timeStamp > 1e12 ? new Date() : performance.now()) - t.timeStamp;
        t.type == "pointerdown"
          ? (function (i, n) {
              var r = function () {
                  X(i, n), a();
                },
                o = function () {
                  a();
                },
                a = function () {
                  removeEventListener("pointerup", r, I),
                    removeEventListener("pointercancel", o, I);
                };
              addEventListener("pointerup", r, I),
                addEventListener("pointercancel", o, I);
            })(e, t)
          : X(e, t);
      }
    },
    le = function (t) {
      ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function (
        e
      ) {
        return t(e, Le, I);
      });
    },
    Y = [100, 300],
    Ce = function (t, e) {
      (e = e || {}),
        D(function () {
          var i,
            n = G(),
            r = m("FID"),
            o = function (s) {
              s.startTime < n.firstHiddenTime &&
                ((r.value = s.processingStart - s.startTime),
                r.entries.push(s),
                i(!0));
            },
            a = function (s) {
              s.forEach(o);
            },
            c = C("first-input", a);
          (i = p(t, r, Y, e.reportAllChanges)),
            c &&
              _(
                U(function () {
                  a(c.takeRecords()), c.disconnect();
                })
              ),
            c &&
              y(function () {
                var s;
                (r = m("FID")),
                  (i = p(t, r, Y, e.reportAllChanges)),
                  (A = []),
                  (P = -1),
                  (g = null),
                  le(addEventListener),
                  (s = o),
                  A.push(s),
                  ue();
              });
        });
    },
    fe = function (t, e) {
      Ce(function (i) {
        (function (n) {
          var r = n.entries[0];
          n.attribution = {
            eventTarget: k(r.target),
            eventType: r.name,
            eventTime: r.startTime,
            eventEntry: r,
            loadState: B(r.startTime),
          };
        })(i),
          t(i);
      }, e);
    },
    me = 0,
    O = 1 / 0,
    x = 0,
    we = function (t) {
      t.forEach(function (e) {
        e.interactionId &&
          ((O = Math.min(O, e.interactionId)),
          (x = Math.max(x, e.interactionId)),
          (me = x ? (x - O) / 7 + 1 : 0));
      });
    },
    pe = function () {
      return N ? me : performance.interactionCount || 0;
    },
    Fe = function () {
      "interactionCount" in performance ||
        N ||
        (N = C("event", we, {
          type: "event",
          buffered: !0,
          durationThreshold: 0,
        }));
    },
    $ = [200, 500],
    ve = 0,
    ee = function () {
      return pe() - ve;
    },
    v = [],
    q = {},
    te = function (t) {
      var e = v[v.length - 1],
        i = q[t.interactionId];
      if (i || v.length < 10 || t.duration > e.latency) {
        if (i) i.entries.push(t), (i.latency = Math.max(i.latency, t.duration));
        else {
          var n = { id: t.interactionId, latency: t.duration, entries: [t] };
          (q[n.id] = n), v.push(n);
        }
        v.sort(function (r, o) {
          return o.latency - r.latency;
        }),
          v.splice(10).forEach(function (r) {
            delete q[r.id];
          });
      }
    },
    Ie = function (t, e) {
      (e = e || {}),
        D(function () {
          Fe();
          var i,
            n = m("INP"),
            r = function (a) {
              a.forEach(function (l) {
                l.interactionId && te(l),
                  l.entryType === "first-input" &&
                    !v.some(function (f) {
                      return f.entries.some(function (u) {
                        return (
                          l.duration === u.duration &&
                          l.startTime === u.startTime
                        );
                      });
                    }) &&
                    te(l);
              });
              var c,
                s = ((c = Math.min(v.length - 1, Math.floor(ee() / 50))), v[c]);
              s &&
                s.latency !== n.value &&
                ((n.value = s.latency), (n.entries = s.entries), i());
            },
            o = C("event", r, { durationThreshold: e.durationThreshold || 40 });
          (i = p(t, n, $, e.reportAllChanges)),
            o &&
              (o.observe({ type: "first-input", buffered: !0 }),
              _(function () {
                r(o.takeRecords()),
                  n.value < 0 && ee() > 0 && ((n.value = 0), (n.entries = [])),
                  i(!0);
              }),
              y(function () {
                (v = []),
                  (ve = pe()),
                  (n = m("INP")),
                  (i = p(t, n, $, e.reportAllChanges));
              }));
        });
    },
    ge = function (t, e) {
      Ie(function (i) {
        (function (n) {
          if (n.entries.length) {
            var r = n.entries.sort(function (o, a) {
              return (
                a.duration - o.duration ||
                a.processingEnd -
                  a.processingStart -
                  (o.processingEnd - o.processingStart)
              );
            })[0];
            n.attribution = {
              eventTarget: k(r.target),
              eventType: r.name,
              eventTime: r.startTime,
              eventEntry: r,
              loadState: B(r.startTime),
            };
          } else n.attribution = {};
        })(i),
          t(i);
      }, e);
    },
    ne = [2500, 4e3],
    z = {},
    he = function (t, e) {
      (function (i, n) {
        (n = n || {}),
          D(function () {
            var r,
              o = G(),
              a = m("LCP"),
              c = function (f) {
                var u = f[f.length - 1];
                u &&
                  u.startTime < o.firstHiddenTime &&
                  ((a.value = Math.max(u.startTime - b(), 0)),
                  (a.entries = [u]),
                  r());
              },
              s = C("largest-contentful-paint", c);
            if (s) {
              r = p(i, a, ne, n.reportAllChanges);
              var l = U(function () {
                z[a.id] ||
                  (c(s.takeRecords()), s.disconnect(), (z[a.id] = !0), r(!0));
              });
              ["keydown", "click"].forEach(function (f) {
                addEventListener(f, l, !0);
              }),
                _(l),
                y(function (f) {
                  (a = m("LCP")),
                    (r = p(i, a, ne, n.reportAllChanges)),
                    H(function () {
                      (a.value = performance.now() - f.timeStamp),
                        (z[a.id] = !0),
                        r(!0);
                    });
                });
            }
          });
      })(function (i) {
        (function (n) {
          if (n.entries.length) {
            var r = L();
            if (r) {
              var o = r.activationStart || 0,
                a = n.entries[n.entries.length - 1],
                c =
                  a.url &&
                  performance.getEntriesByType("resource").filter(function (F) {
                    return F.name === a.url;
                  })[0],
                s = Math.max(0, r.responseStart - o),
                l = Math.max(s, c ? (c.requestStart || c.startTime) - o : 0),
                f = Math.max(l, c ? c.responseEnd - o : 0),
                u = Math.max(f, a ? a.startTime - o : 0),
                h = {
                  element: k(a.element),
                  timeToFirstByte: s,
                  resourceLoadDelay: l - s,
                  resourceLoadTime: f - l,
                  elementRenderDelay: u - f,
                  navigationEntry: r,
                  lcpEntry: a,
                };
              return (
                a.url && (h.url = a.url),
                c && (h.lcpResourceEntry = c),
                void (n.attribution = h)
              );
            }
          }
          n.attribution = {
            timeToFirstByte: 0,
            resourceLoadDelay: 0,
            resourceLoadTime: 0,
            elementRenderDelay: n.value,
          };
        })(i),
          t(i);
      }, e);
    },
    re = [800, 1800],
    Pe = function t(e) {
      document.prerendering
        ? D(function () {
            return t(e);
          })
        : document.readyState !== "complete"
        ? addEventListener(
            "load",
            function () {
              return t(e);
            },
            !0
          )
        : setTimeout(e, 0);
    },
    Be = function (t, e) {
      e = e || {};
      var i = m("TTFB"),
        n = p(t, i, re, e.reportAllChanges);
      Pe(function () {
        var r = L();
        if (r) {
          var o = r.responseStart;
          if (o <= 0 || o > performance.now()) return;
          (i.value = Math.max(o - b(), 0)),
            (i.entries = [r]),
            n(!0),
            y(function () {
              (i = m("TTFB", 0)), (n = p(t, i, re, e.reportAllChanges))(!0);
            });
        }
      });
    },
    Te = function (t, e) {
      Be(function (i) {
        (function (n) {
          if (n.entries.length) {
            var r = n.entries[0],
              o = r.activationStart || 0,
              a = Math.max(r.domainLookupStart - o, 0),
              c = Math.max(r.connectStart - o, 0),
              s = Math.max(r.requestStart - o, 0);
            n.attribution = {
              waitingTime: a,
              dnsTime: c - a,
              connectionTime: s - c,
              requestTime: n.value - s,
              navigationEntry: r,
            };
          } else
            n.attribution = {
              waitingTime: 0,
              dnsTime: 0,
              connectionTime: 0,
              requestTime: 0,
            };
        })(i),
          t(i);
      }, e);
    };
  var J = Oe(),
    De = new URL(J.src),
    Me = De.origin + "/anonymous";
  function xe() {
    var t = function () {
      return Math.floor((1 + Math.random()) * 65536)
        .toString(16)
        .substring(1);
    };
    return (
      "" + t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t()
    );
  }
  function M(t) {
    if (!location.protocol.startsWith("http")) return;
    let e = {
      framerSiteId: J.framerSiteId,
      origin: document.location.origin,
      pathname: document.location.pathname,
      search: document.location.search,
      visitTimeOrigin: performance.timeOrigin,
    };
    fetch(Me, {
      body: JSON.stringify(
        t.map((i) => ({
          ...i,
          data: { ...i.data, context: { ...e, ...i.data.context } },
        }))
      ),
      method: "POST",
      keepalive: !0,
      headers: { "Content-Type": "application/json" },
    });
  }
  function w(t, e) {
    return {
      source: "framer.site",
      timestamp: Date.now(),
      data: { type: "track", uuid: xe(), event: t, ...e },
    };
  }
  function Ae() {
    let t = new Set(),
      [e] = performance.getEntriesByType("navigation"),
      i = document.querySelector("div#main").dataset.framerPageOptimizedAt
        ? new Date(
            document.querySelector("div#main").dataset.framerPageOptimizedAt
          ).getTime()
        : null,
      n = document.querySelector("div#main").dataset.framerSsrReleasedAt
        ? new Date(
            document.querySelector("div#main").dataset.framerSsrReleasedAt
          ).getTime()
        : null,
      { origin: r, pathname: o, search: a } = document.location;
    function c(l) {
      t.add(l);
    }
    function s() {
      if (t.size > 0) {
        let l = [...t].map(({ name: u, delta: h, id: F, attribution: d }) => {
            let T = {
              metric: u,
              label: F,
              value: Math.round(h),
              pageOptimizedAt: i,
              ssrReleasedAt: n,
              context: { origin: r, pathname: o, search: a },
            };
            return (
              u === "LCP" &&
                (T.attributionLcp = S({
                  element: d.element,
                  timeToFirstByte: d.timeToFirstByte,
                  resourceLoadDelay: d.resourceLoadDelay,
                  resourceLoadTime: d.resourceLoadTime,
                  elementRenderDelay: d.elementRenderDelay,
                  url: d.url,
                })),
              u === "CLS" &&
                (T.attributionCls = S({
                  largestShiftTarget: d.largestShiftTarget,
                  largestShiftTime: d.largestShiftTime,
                  largestShiftValue: d.largestShiftValue,
                  loadState: d.loadState,
                })),
              u === "INP" &&
                (T.attributionInp = S({
                  eventTarget: d.eventTarget,
                  eventType: d.eventType,
                  eventTime: d.eventTime ? Math.round(d.eventTime) : void 0,
                  loadState: d.loadState,
                })),
              u === "FID" &&
                (T.attributionFid = S({
                  eventTarget: d.eventTarget,
                  eventType: d.eventType,
                  eventTime: d.eventTime,
                  loadState: d.loadState,
                })),
              u === "FCP" &&
                (T.attributionFcp = S({
                  timeToFirstByte: d.timeToFirstByte,
                  firstByteToFCP: d.firstByteToFCP,
                  loadState: d.loadState,
                })),
              u === "TTFB" &&
                (T.attributionTtfb = S({
                  waitingTime: d.waitingTime,
                  dnsTime: d.dnsTime,
                  connectionTime: d.connectionTime,
                  requestTime: d.requestTime,
                })),
              w("published_site_performance_web_vitals", T)
            );
          }),
          f = w("published_site_performance", {
            domNodes: document.getElementsByTagName("*").length,
            pageLoadDurationMs:
              e.domContentLoadedEventEnd !== void 0 &&
              e.domContentLoadedEventStart !== void 0
                ? Math.round(
                    e.domContentLoadedEventEnd - e.domContentLoadedEventStart
                  )
                : null,
            timeToFirstByteMs: Math.round(e.responseStart),
            resourcesCount: performance.getEntriesByType("resource").length,
            framerCSSSize: document.querySelector(
              "[data-framer-css-ssr-minified]"
            )
              ? document.querySelector("[data-framer-css-ssr-minified]")
                  .innerHTML.length
              : null,
            headSize: document.querySelector("head").innerHTML.length,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            hydrationDurationMs: null,
            pageOptimizedAt: i,
            ssrReleasedAt: n,
            devicePixelRatio: window.devicePixelRatio,
            navigationTiming: {
              activationStart: e.activationStart,
              connectEnd: e.connectEnd,
              connectStart: e.connectStart,
              criticalCHRestart: e.criticalCHRestart,
              decodedBodySize: e.decodedBodySize,
              deliveryType: e.deliveryType,
              domComplete: e.domComplete,
              domContentLoadedEventEnd: e.domContentLoadedEventEnd,
              domContentLoadedEventStart: e.domContentLoadedEventStart,
              domInteractive: e.domInteractive,
              domainLookupEnd: e.domainLookupEnd,
              domainLookupStart: e.domainLookupStart,
              duration: e.duration,
              encodedBodySize: e.encodedBodySize,
              fetchStart: e.fetchStart,
              firstInterimResponseStart: e.firstInterimResponseStart,
              loadEventEnd: e.loadEventEnd,
              loadEventStart: e.loadEventStart,
              nextHopProtocol: e.nextHopProtocol,
              redirectCount: e.redirectCount,
              redirectEnd: e.redirectEnd,
              redirectStart: e.redirectStart,
              requestStart: e.requestStart,
              responseEnd: e.responseEnd,
              responseStart: e.responseStart,
              responseStatus: e.responseStatus,
              secureConnectionStart: e.secureConnectionStart,
              serverTiming: e.serverTiming
                ? JSON.stringify(e.serverTiming)
                : null,
              startTime: e.startTime,
              transferSize: e.transferSize,
              type: e.type,
              unloadEventEnd: e.unloadEventEnd,
              unloadEventStart: e.unloadEventStart,
              workerStart: e.workerStart,
            },
            connection: S({
              downlink: navigator.connection?.downlink,
              downlinkMax: navigator.connection?.downlinkMax,
              effectiveType: navigator.connection?.effectiveType,
              rtt: navigator.connection?.rtt,
              saveData: navigator.connection?.saveData,
              type: navigator.connection?.type,
            }),
            context: { origin: r, pathname: o, search: a },
          });
        t.clear(), M([...l, f]);
      }
    }
    fe(c),
      he(c),
      de(c),
      se(({ delta: l, ...f }) => {
        c({ ...f, delta: l * 1e3 });
      }),
      ge(c),
      Te(c),
      addEventListener("visibilitychange", () => {
        document.visibilityState === "hidden" && s();
      }),
      addEventListener("pagehide", s);
  }
  function Re() {
    window.addEventListener("popstate", j),
      typeof Proxy < "u" &&
        (window.history.pushState = new Proxy(window.history.pushState, {
          apply: (t, e, i) => {
            t.apply(e, i), j();
          },
        }));
  }
  function j(t) {
    let e = [
      w("published_site_pageview", {
        referrer: (t && t.initialReferrer) || null,
        url: location.href,
        hostname: location.hostname || null,
        pathname: location.pathname || null,
        hash: location.hash || null,
        search: location.search || null,
        framerSiteId: J.framerSiteId,
      }),
    ];
    M(e);
  }
  function ke() {
    window.__send_framer_event = (t, e) => {
      let i = w(t, e);
      M([i]);
    };
  }
  var V = "__framer_events";
  function be() {
    let t = window[V];
    if (t && t.length > 0) {
      let e = t.map((i) => w.apply(null, i));
      M(e);
    }
    (window[V] = []),
      (window[V].push = function () {
        let e = [];
        for (var i = 0; i < arguments.length; i++)
          e.push(w.apply(null, arguments[i]));
        M(e);
      });
  }
  function _e(t) {
    return Object.values(t).some((e) => e !== void 0);
  }
  function S(t) {
    return _e(t) ? t : void 0;
  }
  function Oe() {
    return document.currentScript
      ? {
          src: document.currentScript.src,
          framerSiteId: document.currentScript.getAttribute("data-fid"),
        }
      : { src: "https://events.framer.com/", framerSiteId: null };
  }
  (function () {
    let t = typeof document.referrer == "string";
    Ae(),
      Re(),
      ke(),
      be(),
      j({ initialReferrer: (t && document.referrer) || null });
  })();
})();
