import { css } from "@/styled-system/css";
import ReactMarkdown from "react-markdown";

export function VaultFAQPanel() {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        gap: 16,
        padding: "24px 0 24px 0"
      })}
    >
      <div className={css({
        display: "flex",
        flexDirection: "column",
        gap: 16,
      })}>
        <h2
          className={css({
            fontSize: 28,
            marginBottom: 4,
          })}>
          Factsheet
        </h2>
        <FactSheetPanel
          title="FactSheet"
          content={`The BitVault BTC Yield Fund is an actively managed Bitcoin yield fund operated by BV Labs Ltd. The fund provides investors with access to institutional-grade yield strategies while maintaining full exposure to Bitcoin price performance.

The fund tracks the performance of a diversified portfolio of both stablecoin-denominated and Bitcoin-denominated yield strategies. BV Labs Ltd. is responsible for portfolio construction, risk management, and capital allocation, with a focus on liquidity preservation, capital efficiency, and downside protection.

The minimum investment is 1 BTC, positioning the fund for professional and institutional investors. The portfolio is exclusively composed of low-risk yield strategies, ensuring high credit quality, conservative risk exposure, and strong liquidity across market conditions.`} />
        <FactSheetPanel
          title="Strategy Composition"
          items={[
            { title: "Market-Neutral Arbitrage", subtitle: "Basis, Funding & Cross-Venue Arbitrage", content: "50%" },
            { title: "Liquidity Provision & Market Making", subtitle: "DEX LPs, Pendle LP, Passive Market Making", content: "50%" },
          ]} />
        <FactSheetPanel
          title="Fee Structure"
          items={[
            { title: "Management Fee", subtitle: "0.50% per annum", content: "50%" },
            { title: "Performance Fee", subtitle: "20% of net profits", content: "20%" },
            { title: "Deposit Fee", subtitle: "", content: "0%" },
            { title: "Withdrawal Fee", subtitle: "", content: "0%" },
          ]} />
      </div>
    </div>
  );
}

function FactSheetPanel({ title, content, items}: { title: string, content?: string, items?: FactSheetItem[]}) {
  return (
    <div
      className={css({
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "12px 16px",
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        width: "100%",
        userSelect: "none",
        color: `token(colors.content)`,
        background: `token(colors.infoSurface)`,
        borderColor: "token(colors.neutral100)",
      })}
    >
      <h2
        className={css({
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 4,
        })}
      >
        {title}
      </h2>
      {content && (
        <div
          className={css({
            fontSize: 16,
            fontWeight: 400,
            marginBottom: 4,
            color: "contentAlt",
          })}
        >
          <MarkdownContent content={content} />
        </div>
      )}
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 12,
        })}
      >
        {items?.map((item) => (
          <FactSheetItem key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}

type FactSheetItem = {
  title: string;
  subtitle?: string;
  content?: string;
}

function FactSheetItem({ title, subtitle, content }: FactSheetItem) {
  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        background: "token(colors.controlSurface)",
        borderRadius: 8,
      })}
    >
      <div>
        <h3
          className={css({
            fontSize: 16,
            fontWeight: 400,
            color: "content",
          })}
        >
          {title}
        </h3>
        <p
          className={css({
            fontSize: 16,
            fontWeight: 400,
            color: "contentAlt",
          })}
        >
          {subtitle}
        </p>
      </div>
      <div>
        <p
          className={css({
            fontSize: 16,
            fontWeight: 400,
            color: "accent",
          })}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p
            className={css({
              margin: 0,
              marginBottom: 8,
              "&:last-child": {
                marginBottom: 0,
              },
            })}
          >
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul
            className={css({
              margin: 0,
              paddingLeft: 20,
              marginBottom: 8,
              "&:last-child": {
                marginBottom: 0,
              },
            })}
          >
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol
            className={css({
              margin: 0,
              paddingLeft: 20,
              marginBottom: 8,
              "&:last-child": {
                marginBottom: 0,
              },
            })}
          >
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li
            className={css({
              marginBottom: 4,
              "&:last-child": {
                marginBottom: 0,
              },
            })}
          >
            {children}
          </li>
        ),
        h1: ({ children }) => (
          <h1
            className={css({
              fontSize: 24,
              fontWeight: 600,
              margin: 0,
              marginBottom: 8,
              "&:last-child": {
                marginBottom: 0,
              },
            })}
          >
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2
            className={css({
              fontSize: 20,
              fontWeight: 600,
              margin: 0,
              marginBottom: 8,
              "&:last-child": {
                marginBottom: 0,
              },
            })}
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3
            className={css({
              fontSize: 18,
              fontWeight: 600,
              margin: 0,
              marginBottom: 8,
              "&:last-child": {
                marginBottom: 0,
              },
            })}
          >
            {children}
          </h3>
        ),
        strong: ({ children }) => (
          <strong
            className={css({
              fontWeight: 600,
            })}
          >
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em
            className={css({
              fontStyle: "italic",
            })}
          >
            {children}
          </em>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className={css({
              color: "accent",
              textDecoration: "underline",
            })}
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code
            className={css({
              padding: "2px 4px",
              background: "token(colors.controlSurface)",
              borderRadius: 4,
              fontSize: 14,
              fontFamily: "monospace",
            })}
          >
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}