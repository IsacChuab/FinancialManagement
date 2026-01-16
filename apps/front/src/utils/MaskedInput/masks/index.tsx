import { useMemo } from 'react';
import moneyMask from './money';

export type MaskAdapter = {
  apply(this: void, value: string | number | undefined | null): string | null | undefined;
  clean(this: void, value: string | number | undefined | null): string;
};

type MaskValue = string | number | undefined | null;

const builtInMasks = {
  money: moneyMask,
} as const;

export type BuiltInMasks = keyof typeof builtInMasks;

export default function useMask(mask: BuiltInMasks | MaskAdapter | undefined, value: MaskValue) {
  const { apply: maskApply, clean: maskClean } = useMemo<MaskAdapter>(() => {
    const maskFunction = typeof mask === 'string' ? builtInMasks[mask] : mask;
    return maskFunction ?? ({ apply: (v) => v, clean: (v) => v } as MaskAdapter);
  }, [mask]);

  const maskedValue = useMemo(() => (maskApply ? maskApply(value) : value), [value, maskApply]);
  const cleanedValue = useMemo(() => (maskClean ? maskClean(value) : value), [value, maskClean]);

  return { maskApply, maskClean, maskedValue, cleanedValue };
}
