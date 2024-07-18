import { forwardRef, useEffect, useRef, useState } from "react";

import { resizeInBoundary, registDragEvent } from "./utils";
import {
  BOUNDARY_MARGIN,
  MIN_H,
  MIN_W,
  DEFAULT_W,
  DEFAULT_H,
  cardinalDirection,
} from "./constants";
import {
  PolymorphicComponentProps,
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from "./type";

type _ResizableBoxProps = {
  [K in keyof typeof cardinalDirection]?: boolean;
} & {
  width?: number;
  height?: number;
  startX?: number;
  startY?: number;
  handleThickness?: number;
  isBoundaryViewport?: boolean;
  onlyCorners?: boolean;
};

type ResizableBoxProps<C extends React.ElementType> = PolymorphicComponentProps<
  C,
  _ResizableBoxProps
>;

type ResizableBoxType = <T extends React.ElementType = "div">(
  props: PolymorphicComponentPropsWithRef<T, ResizableBoxProps<T>>,
) => React.ReactNode;

const ResizableBox: ResizableBoxType = forwardRef(
  function ResizableBox<T extends React.ElementType = "div">(
    {
      NW = true,
      N = true,
      NE = true,
      E = true,
      SE = true,
      S = true,
      SW = true,
      W = true,
      width = DEFAULT_W,
      height = DEFAULT_H,
      startX = 0,
      startY = 0,
      handleThickness = 16,
      isBoundaryViewport = false,
      // onlyCorners = false,
      children,
      ...props
    }: ResizableBoxProps<T>,
    ref: PolymorphicRef<T>,
  ) {
    const [{ x, y, w, h }, setConfig] = useState({
      x: startX,
      y: startY,
      w: width,
      h: height,
    });

    const fallbackBoundaryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const boundary = isBoundaryViewport
        ? fallbackBoundaryRef.current?.getBoundingClientRect()
        : ref?.current?.getBoundingClientRect();

      if (boundary) {
        console.log(ref, width, height);
        setConfig((prev) => ({
          ...prev,
          x: Math.floor(boundary.width / 2 - width / 2),
          y: Math.floor(boundary.height / 2 - height / 2),
        }));
      }
    }, [width, height, isBoundaryViewport, ref]);

    return (
      <div
        ref={isBoundaryViewport ? fallbackBoundaryRef : ref}
        style={
          isBoundaryViewport
            ? {
                width: "calc(100vw - (100vw - 100%))",
                height: "100vh",
                position: "fixed",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                top: 0,
                left: 0,
                zIndex: 9999,
              }
            : undefined
        }
      >
        <div
          style={{
            width: w,
            height: h,
            left: x,
            top: y,
            position: isBoundaryViewport ? "relative" : "absolute",
          }}
          {...registDragEvent((deltaX, deltaY) => {
            if (!ref.current) return;

            const boundary = isBoundaryViewport
              ? fallbackBoundaryRef.current?.getBoundingClientRect()
              : ref?.current?.getBoundingClientRect();

            setConfig({
              x: resizeInBoundary(
                x + deltaX,
                BOUNDARY_MARGIN,
                boundary.width - w - BOUNDARY_MARGIN,
              ),
              y: resizeInBoundary(
                y + deltaY,
                BOUNDARY_MARGIN,
                boundary.height - h - BOUNDARY_MARGIN,
              ),
              w,
              h,
            });
          })}
          {...props}
        >
          {children}
          {NW && (
            <div
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                cursor: "nw-resize",
                top: 0,
                left: 0,
                height: handleThickness,
                width: handleThickness,
                zIndex: 2,
              }}
              {...registDragEvent((deltaX, deltaY) => {
                setConfig({
                  x: resizeInBoundary(
                    x + deltaX,
                    BOUNDARY_MARGIN,
                    x + w - MIN_W,
                  ),
                  y: resizeInBoundary(
                    y + deltaY,
                    BOUNDARY_MARGIN,
                    y + h - MIN_H,
                  ),
                  w: resizeInBoundary(
                    w - deltaX,
                    MIN_W,
                    x + w - BOUNDARY_MARGIN,
                  ),
                  h: resizeInBoundary(
                    h - deltaY,
                    MIN_H,
                    y + h - BOUNDARY_MARGIN,
                  ),
                });
              }, true)}
            />
          )}
          {N && (
            <div
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: handleThickness,
                cursor: "n-resize",
                zIndex: 1,
              }}
              {...registDragEvent((_, deltaY) => {
                setConfig({
                  x,
                  y: resizeInBoundary(
                    y + deltaY,
                    BOUNDARY_MARGIN,
                    y + h - MIN_H,
                  ),
                  w,
                  h: resizeInBoundary(
                    h - deltaY,
                    MIN_H,
                    y + h - BOUNDARY_MARGIN,
                  ),
                });
              }, true)}
            />
          )}
          {NE && (
            <div
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                cursor: "ne-resize",
                top: 0,
                right: 0,
                height: handleThickness,
                width: handleThickness,
                zIndex: 2,
              }}
              {...registDragEvent((deltaX, deltaY) => {
                if (!ref.current) return;

                const boundary = isBoundaryViewport
                  ? fallbackBoundaryRef.current?.getBoundingClientRect()
                  : ref?.current?.getBoundingClientRect();

                setConfig({
                  x,
                  y: resizeInBoundary(
                    y + deltaY,
                    BOUNDARY_MARGIN,
                    y + h - MIN_H,
                  ),
                  w: resizeInBoundary(
                    w + deltaX,
                    MIN_W,
                    boundary.width - x - BOUNDARY_MARGIN,
                  ),
                  h: resizeInBoundary(
                    h - deltaY,
                    MIN_H,
                    y + h - BOUNDARY_MARGIN,
                  ),
                });
              }, true)}
            />
          )}
          {E && (
            <div
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                width: handleThickness,
                cursor: "e-resize",
                zIndex: 1,
              }}
              {...registDragEvent((deltaX) => {
                if (!ref.current) return;

                const boundary = isBoundaryViewport
                  ? fallbackBoundaryRef.current?.getBoundingClientRect()
                  : ref?.current?.getBoundingClientRect();

                setConfig({
                  x,
                  y,
                  w: resizeInBoundary(
                    w + deltaX,
                    MIN_W,
                    boundary.width - x - BOUNDARY_MARGIN,
                  ),
                  h,
                });
              }, true)}
            />
          )}
          {SE && (
            <div
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                bottom: 0,
                right: 0,
                height: handleThickness,
                width: handleThickness,
                cursor: "se-resize",
                zIndex: 2,
              }}
              {...registDragEvent((deltaX, deltaY) => {
                if (!ref.current) return;

                const boundary = isBoundaryViewport
                  ? fallbackBoundaryRef.current?.getBoundingClientRect()
                  : ref?.current?.getBoundingClientRect();

                setConfig({
                  x,
                  y,
                  w: resizeInBoundary(
                    w + deltaX,
                    MIN_W,
                    boundary.width - x - BOUNDARY_MARGIN,
                  ),
                  h: resizeInBoundary(
                    h + deltaY,
                    MIN_H,
                    boundary.height - y - BOUNDARY_MARGIN,
                  ),
                });
              }, true)}
            />
          )}
          {S && (
            <div
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: handleThickness,
                cursor: "s-resize",
                zIndex: 1,
              }}
              {...registDragEvent((_, deltaY) => {
                if (!ref.current) return;

                const boundary = isBoundaryViewport
                  ? fallbackBoundaryRef.current?.getBoundingClientRect()
                  : ref?.current?.getBoundingClientRect();

                setConfig({
                  x,
                  y,
                  w,
                  h: resizeInBoundary(
                    h + deltaY,
                    MIN_H,
                    boundary.height - y - BOUNDARY_MARGIN,
                  ),
                });
              }, true)}
            />
          )}
          {SW && (
            <div
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                cursor: "sw-resize",
                bottom: 0,
                left: 0,
                height: handleThickness,
                width: handleThickness,
                zIndex: 2,
              }}
              {...registDragEvent((deltaX, deltaY) => {
                if (!ref.current) return;

                const boundary = isBoundaryViewport
                  ? fallbackBoundaryRef.current?.getBoundingClientRect()
                  : ref?.current?.getBoundingClientRect();

                setConfig({
                  x: resizeInBoundary(
                    x + deltaX,
                    BOUNDARY_MARGIN,
                    x + w - MIN_W,
                  ),
                  y,
                  w: resizeInBoundary(
                    w - deltaX,
                    MIN_W,
                    x + w - BOUNDARY_MARGIN,
                  ),
                  h: resizeInBoundary(
                    h + deltaY,
                    MIN_H,
                    boundary.height - y - BOUNDARY_MARGIN,
                  ),
                });
              }, true)}
            />
          )}
          {W && (
            <div
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                cursor: "w-resize",
                top: 0,
                bottom: 0,
                left: 0,
                width: handleThickness,
                zIndex: 1,
              }}
              {...registDragEvent((deltaX) => {
                setConfig({
                  x: resizeInBoundary(
                    x + deltaX,
                    BOUNDARY_MARGIN,
                    x + w - MIN_W,
                  ),
                  y,
                  w: resizeInBoundary(
                    w - deltaX,
                    MIN_W,
                    x + w - BOUNDARY_MARGIN,
                  ),
                  h,
                });
              }, true)}
            />
          )}
        </div>
      </div>
    );
  },
);

export default ResizableBox;
