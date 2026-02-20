import { useCallback, useRef, useState } from "react";

type MobileSortableParams = {
  billId: string;
  onReorderMobile: (sourceId: string, targetId: string) => void;
  longPress?: number;
};

export function useMobileReorder({billId, onReorderMobile: onReorderMobile, longPress = 400}: MobileSortableParams) {
  const timerRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const cancelLongPress = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }
  
  const getBillIdFromPoint = (x: number, y: number): string | null => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    if (!el) {
      return null;
    }

    const card = el.closest("[data-bill-id]");
    return (card as HTMLElement)?.dataset.billId || null;
    
  }

  const onTouchStart = useCallback(() => {
    cancelLongPress();

    timerRef.current = window.setTimeout(() => {
      draggingRef.current = true;
      setIsDragging(true);
    }, longPress);
  }, [longPress]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!draggingRef.current) {
      return;
    }

    const touch = e.touches[0];
    const targetBillId = getBillIdFromPoint(touch.clientX, touch.clientY);

    if (!targetBillId || targetBillId === billId) {
      return;
    }

    onReorderMobile(billId, targetBillId);
  }, [billId, onReorderMobile]);

  const onTouchEnd = useCallback(() => {
    cancelLongPress();
    draggingRef.current = false;
    setIsDragging(false);
  }, []);

  const bind = {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel: onTouchEnd,
  };

  return {
    isDragging,
    bind
  };
}
