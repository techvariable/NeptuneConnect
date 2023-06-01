export const timeout = async (timeDelta: number): Promise<unknown> =>
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve(true)
    }, timeDelta)
  )
