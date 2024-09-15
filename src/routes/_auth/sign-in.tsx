import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/sign-in')({
  component: () => <div>Hello /_auth/sign-in!</div>,
})
