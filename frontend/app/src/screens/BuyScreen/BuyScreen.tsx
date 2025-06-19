"use client";

import type { Dnum } from "@/src/types";

import { Field } from "@/src/comps/Field/Field";
import { Screen } from "@/src/comps/Screen/Screen";
import { dnum18, dnumMax } from "@/src/dnum-utils";
import { useInputFieldValue } from "@/src/form-utils";
import { fmtnum } from "@/src/formatting";
import { usePrice } from "@/src/services/Prices";
import { useAccount, useBalance } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import {
  Button,
  COLLATERALS,
  InputField,
  TextButton,
  TokenIcon,
} from "@liquity2/uikit";
import * as dn from "dnum";
import { useState } from "react";
import { useTransactionFlow } from "@/src/services/TransactionFlow";
import { PanelConvert } from "./PanelConvert";

export function BuyScreen() {
  const account = useAccount();

  return (
    <Screen
      heading={{
        title: "Buy bvUSD with any token",
        subtitle: "",
      }}
    >
      <PanelConvert />
    </Screen>
  );
}
