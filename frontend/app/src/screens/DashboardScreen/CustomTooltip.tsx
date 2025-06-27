import { TooltipProps } from 'recharts';


type CustomTooltipProps = TooltipProps<any, any> & {
  transformValue?: (value: number) => string;
};

export const CustomTooltip = ({ active, payload, transformValue }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      style={{
        background: "rgba(58, 60, 35, 0.97)",
        padding: "10px",
        borderRadius: 6,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        fontFamily: "sans-serif",
      }}
    >
      {payload.map((entry: any, index: number) => {
        const color = entry.color || "#aaa";
        return (
          <div
            key={`item-${index}`}
            style={{
              color,
              fontWeight: 600,
              fontSize: 14,
              marginBottom: 4,
            }}
          >
            {entry.name} : {transformValue ? transformValue(entry.value) : entry.value}
          </div>
        );
      })}
    </div>
  );
};
