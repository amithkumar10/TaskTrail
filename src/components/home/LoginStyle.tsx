import React from 'react'

const LoginStyle = () => {
  return (
     <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.root {
  min-height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  /* Fixed: added closing quote, parenthesis, and semicolon */
  background-image: url('https://static.vecteezy.com/system/resources/thumbnails/042/673/230/small/hexagon-security-electronic-for-safety-with-hologram-concept-for-future-technology-element-background-business-screen-vector.jpg');
  /* Optional: keeps the image from tiling and makes it cover the screen */
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}

        .bg-blob-1 {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(250,230,150,0.45) 0%, transparent 70%);
          top: -160px;
          right: -120px;
          pointer-events: none;
        }
        .bg-blob-2 {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(187,247,208,0.4) 0%, transparent 70%);
          bottom: -100px;
          left: -80px;
          pointer-events: none;
        }
        .bg-blob-3 {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(254,215,170,0.5) 0%, transparent 70%);
          bottom: 80px;
          right: 10%;
          pointer-events: none;
        }

        .card {
          position: relative;
          background: #ffffff;
          border-radius: 28px;
          padding: 44px 40px 40px;
          max-width: 430px;
          max-height: 100vh;
          width: 100%;
          height: 100%;
          box-shadow:
            0 1px 0 rgba(0,0,0,0.04),
            0 4px 6px rgba(0,0,0,0.03),
            0 20px 60px rgba(0,0,0,0.09);
          opacity: 0;
          transform: translateY(20px) scale(0.98);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .company-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #f0fdf4;
          border: 1.5px solid #bbf7d0;
          border-radius: 100px;
          padding: 5px 13px 5px 9px;
          margin-bottom: 30px;
        }
        .company-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16a34a;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(22,163,74,0); }
        }
        .company-text {
          font-size: 12px;
          font-weight: 600;
          color: #15803d;
          letter-spacing: 0.01em;
        }

        .title{
           font-family: Verdana, Geneva, sans-serif;
          font-size: 40px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 60px;
          letter-spacing: -0.02em;
        }

        .heading {
          font-family: 'Fraunces', serif;
          font-size: 34px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.18;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }
        .heading em {
          font-style: italic;
          color: #ca8a04;
        }

        .subtext {
          font-size: 14.5px;
          color: #6b7280;
          line-height: 1.65;
          margin-bottom: 26px;
          font-weight: 400;
        }

        .pills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 28px;
        }
        .pill {
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 100px;
          padding: 5px 13px;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        select{
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 8px 12px;
        }
       
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 30px;
        }
        .stat-box {
          background: #fafafa;
          border: 1.5px solid #f0f0f0;
          border-radius: 16px;
          padding: 14px 10px 12px;
          text-align: center;
          transition: border-color 0.2s, transform 0.2s;
        }
        .stat-box:hover {
          border-color: #d1d5db;
          transform: translateY(-2px);
        }
        .stat-val {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 10.5px;
          color: #9ca3af;
          font-weight: 500;
        }

        .divider {
          height: 1px;
          background: #f3f4f6;
          margin-bottom: 24px;
        }

        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          display: flex;
          justify-content: center;
        }
        .btn-primary {
          background: #1a1a1a;
          color: #ffffff;
          border: none;
          border-radius: 14px;
          padding: 16px 18px;
          max-width: 350px;
          width: 100%;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s, transform 0.15s;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 3px;
        }
        .btn-primary:hover {
          background: #2d2d2d;
          transform: translateY(-2px);
        }
        .btn-primary:active { transform: translateY(0); }

        .btn-secondary {
          background: #fefce8;
          color: #713f12;
          border: 1.5px solid #fde68a;
          border-radius: 14px;
          padding: 16px 18px;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s, transform 0.15s;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .btn-secondary:hover {
          background: #fef9c3;
          transform: translateY(-2px);
        }
        .btn-secondary:active { transform: translateY(0); }

        .btn-title {
          font-family: 'Fraunces', serif;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-hint {
          font-size: 11px;
          opacity: 0.55;
          font-weight: 400;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .footer-note {
          margin-top: 22px;
          text-align: center;
          font-size: 11.5px;
          color: #c4c4c4;
        }
        .footer-note span {
          color: #d1d5db;
          font-weight: 600;
        }

        .corner-tl, .corner-br {
          position: absolute;
          width: 22px;
          height: 22px;
          pointer-events: none;
          opacity: 0.15;
        }
        .corner-tl {
          top: 16px; left: 16px;
          border-top: 2px solid #1a1a1a;
          border-left: 2px solid #1a1a1a;
          border-radius: 4px 0 0 0;
        }
        .corner-br {
          bottom: 16px; right: 16px;
          border-bottom: 2px solid #1a1a1a;
          border-right: 2px solid #1a1a1a;
          border-radius: 0 0 4px 0;
        }

        .parent-input{
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        input{
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 8px 12px;
          focus: outline-none;
          focus: ring-2;
          focus: ring-blue-500;
        }
      `}</style>
  )
}

export default LoginStyle