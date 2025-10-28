import { VaultPoolScreen } from "@/src/screens/VaultScreen/VaultScreen";

export function generateStaticParams() {
    return [
      { pool: "bvbtc" }
    ];
  }
  
  type Params = { symbol: string };

  export default function VaultPage({params} : {params: Params}) {
    return <VaultPoolScreen asset={params.symbol}/>;
}