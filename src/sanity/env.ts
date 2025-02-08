export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-05'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token= assertValue(
  "skIdlClagrNTaTM7OXOLF8T6SoXUbkIkJ6oWscJqTl9ORWXD2g2Ad51nNBrUGdricmgPZg9VwMx2O0bDEejmPBS6rfzhwlpMIvkR58gcvNGqUGnz8mhPkf4SBWoMdMfCfaSywJXIhXLdYABNe4kCPp8MJnjoHdVYTbLBCOOMtDefW2S47cjP",
  'Missing environment variable:NEXT_API_TOKEN'
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
