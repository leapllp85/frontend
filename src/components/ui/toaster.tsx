"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"
import type {
  CreateToasterProps,
  CreateToasterReturn,
  ToastRootProps,
  ToasterProps as ChakraToasterProps,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
})

export function createAppToaster(options: CreateToasterProps) {
  return createToaster({
    pauseOnPageIdle: true,
    ...options,
  })
}

type ToastRootPropGetter = (toast: Parameters<NonNullable<ChakraToasterProps["children"]>>[0]) => ToastRootProps

export type AppToasterProps = {
  toasterInstance?: CreateToasterReturn
  toasterProps?: Omit<ChakraToasterProps, "children" | "toaster">
  rootProps?: ToastRootProps | ToastRootPropGetter
  width?: ToastRootProps["width"]
}

export const Toaster = ({
  toasterInstance = toaster,
  toasterProps,
  rootProps,
  width = { md: "sm" },
}: AppToasterProps = {}) => {
  return (
    <Portal>
      <ChakraToaster toaster={toasterInstance} insetInline={{ mdDown: "4" }} {...toasterProps}>
        {(toast) => (
          <Toast.Root
            width={width}
            {...(typeof rootProps === "function" ? rootProps(toast) : rootProps)}
          >
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
