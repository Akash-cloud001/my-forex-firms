// TradingViewWidget.jsx
"use client"
import React, { useEffect, useRef, memo } from 'react';

function TradingViewTicker() {
  const container = useRef();

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbols": [
            {
              "proName": "FOREXCOM:SPXUSD",
              "title": "S&P 500 Index"
            },
            {
              "proName": "FOREXCOM:NSXUSD",
              "title": "US 100 Cash CFD"
            },
            {
              "proName": "FX_IDC:EURUSD",
              "title": "EUR to USD"
            },
            {
              "proName": "BITSTAMP:BTCUSD",
              "title": "Bitcoin"
            },
            {
              "proName": "BITSTAMP:ETHUSD",
              "title": "Ethereum"
            }
          ],
          "colorTheme": "dark",
          "locale": "en",
          "largeChartUrl": "",
          "isTransparent": false,
          "showSymbolLogo": true,
          "displayMode": "regular"
        }`;
      container.current.appendChild(script);
    },
    []
  );

  return (
    <div className="tradingview-widget-container fixed -bottom-8 bg-background z-50 w-full" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright outline-none focus:outline-none"><a href="https://www.tradingview.com/markets/" rel="noopener nofollow" target="_blank"><span className="blue-text">Ticker tape</span></a><span className="trademark"> by TradingView</span></div>
    </div>
  );
}

export default memo(TradingViewTicker);
