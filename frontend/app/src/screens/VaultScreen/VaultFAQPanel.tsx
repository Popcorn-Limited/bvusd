import content from "@/src/content";
import { css } from "@/styled-system/css";
import ReactMarkdown from "react-markdown";
import { Address } from "viem";

export function VaultFAQPanel({ vaultAddress }: { vaultAddress: Address }) {
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
          content={content.vaultScreen.faq.factsheet.content[vaultAddress] ?? content.vaultScreen.faq.factsheet.content.default}
          items={content.vaultScreen.faq.factsheet.items[vaultAddress] ?? content.vaultScreen.faq.factsheet.items.default}
        />
        <FactSheetPanel
          title="Strategy Composition"
          items={content.vaultScreen.faq.strategyComposition[vaultAddress] ?? content.vaultScreen.faq.strategyComposition.default} />
        <FactSheetPanel
          title="Fee Structure"
          items={[
            {
              title: "Management Fee",
              subtitle: "per annum",
              content: content.vaultScreen.faq.feeStructure.mangementFee[vaultAddress] ?? content.vaultScreen.faq.feeStructure.mangementFee.default
            },
            {
              title: "Performance Fee",
              subtitle: "of net profits",
              content: content.vaultScreen.faq.feeStructure.performanceFee[vaultAddress] ?? content.vaultScreen.faq.feeStructure.performanceFee.default
            },
            {
              title: "Deposit Fee",
              subtitle: "",
              content: content.vaultScreen.faq.feeStructure.depositFee[vaultAddress] ?? content.vaultScreen.faq.feeStructure.depositFee.default
            },
            {
              title: "Withdrawal Fee",
              subtitle: "",
              content: content.vaultScreen.faq.feeStructure.withdrawalFee[vaultAddress] ?? content.vaultScreen.faq.feeStructure.withdrawalFee.default
            },
          ]} />
        <FactSheetPanel
          title="Risk Disclosure"
          items={content.vaultScreen.faq.riskDisclosure[vaultAddress] ?? content.vaultScreen.faq.riskDisclosure.default} />
        <FactSheetPanel
          title="Technical Details"
          items={content.vaultScreen.faq.technicalDetails[vaultAddress] ?? content.vaultScreen.faq.technicalDetails.default} />
      </div>
    </div>
  );
}

function FactSheetPanel({ title, content, items }: { title: string, content?: string, items?: FactSheetItem[] }) {
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