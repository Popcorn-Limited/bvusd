"use client"

import { ConnectWarningBox } from "@/src/comps/ConnectWarningBox/ConnectWarningBox";
import { Screen } from "@/src/comps/Screen/Screen";
import { WhitelistModal } from "@/src/screens/HomeScreen/WhitelistModal";
import PointsPanel from "@/src/screens/PointScreen/PointsPanel";
import { useModal } from "@/src/services/ModalService";
import { Button } from "@liquity2/uikit";

export default function Page() {
  const { setVisible: setModalVisibility, setContent: setModalContent } = useModal()

  return (
    <Screen
      heading={{
        title: "Bits Program is coming soon",
        subtitle: "We’re in Phase 1 (Institutional Access). Public access opens next. Join the whitelist to get launch timing and start earning Bits from day one once you activate",
      }} 
    >
      {/* <ConnectWarningBox /> */}
      {/* <PointsPanel showHeader={false} /> */}
      {/* <TokenLockPanel /> */}
      <Button
        label="Join the whitelist"
        mode="primary"
        size="medium"
        shape="rectangular"
        onClick={() => {
          setModalContent(<WhitelistModal />);
          setModalVisibility(true);
        }}
      />
    </Screen>
  );
}