export const usePocketBaseFile = () => {
  const { public: { pocketbaseUrl } } = useRuntimeConfig()

  return (collection: string, recordId: string, filename: string) =>
    filename ? `${pocketbaseUrl}/api/files/${collection}/${recordId}/${filename}` : ""
}
