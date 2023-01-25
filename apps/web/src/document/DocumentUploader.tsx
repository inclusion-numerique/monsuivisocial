'use client'
import { FileError, FileRejection, useDropzone } from 'react-dropzone'
import { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { trpc } from '@mss/web/trpc'
import { Spinner } from '@mss/web/ui/Spinner'

type UploadingFileInfo = {
  file: File
  status: 'pending' | 'uploaded' | 'error'
  key?: string
}

const UploadedFileRow = styled.li`
  display: flex;
  align-items: center;
`

const DocumentUploader = ({
  onChange,
  beneficiaryId,
}: {
  beneficiaryId: string
  onChange: (files: UploadingFileInfo[]) => void
}) => {
  const [files, setFiles] = useState<UploadingFileInfo[]>([])

  const createUploadUrl =
    trpc.beneficiary.document.createUploadUrl.useMutation()

  const onDrop = async (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
  ) => {
    const addedFiles = acceptedFiles.map(
      (file): UploadingFileInfo => ({ file, status: 'pending' }),
    )

    setFiles([...files, ...addedFiles])

    const uploadedFiles = await Promise.all(
      acceptedFiles.map(async (file): Promise<UploadingFileInfo> => {
        const { url, key } = await createUploadUrl.mutateAsync({
          name: file.name,
          mimeType: file.type,
          beneficiaryId,
        })

        await axios.put(url, file, {
          headers: {
            'Content-Type': file.type,
            'Access-Control-Allow-Origin': '*',
          },
        })

        return { key, status: 'uploaded', file }
      }),
    )

    setFiles([...files, ...uploadedFiles])
    onChange([...files, ...uploadedFiles])
  }

  const onRemove = (index: number) => {
    const updatedFiles = [...files]
    updatedFiles.splice(index, 1)
    setFiles(updatedFiles)
    onChange(updatedFiles)
  }

  const validator = (file: File): FileError | FileError[] | null => {
    return null
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    // accept: [], TODO what is this ?
    minSize: 100,
    maxSize: 40_000_000, // 40 M
    maxFiles: 10,
    preventDropOnDocument: true,
    disabled: false, // TODO When uploading?
    onError: (err: Error) => {
      // TODO SENTRY
      console.error(err)
    },
    validator,
  })

  return (
    <>
      <div
        className="fr-card fr-background-contrast--grey"
        style={{ height: 'auto', borderRadius: '4px 4px 0 0' }}
      >
        <div
          className="fr-p-8v"
          style={{ cursor: 'pointer' }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p className="" style={{ pointerEvents: 'none' }}>
            Vous pouvez <strong>glisser-déposer</strong> le document ici,{' '}
            <strong>ou cliquer</strong> pour sélectionner un fichier depuis
            votre ordinateur.
          </p>
        </div>
      </div>
      <ul className="fr-mt-4v fr-raw-list">
        {files.map((file, index) => (
          <UploadedFileRow key={file.key ?? index} className="fr-mt-2v">
            {file.status === 'pending' ? (
              <Spinner size="sm" />
            ) : (
              <span className="fr-icon-checkbox-circle-fill fr-text-label--blue-france" />
            )}
            <span className="fr-ml-4v fr-m-0">{file.file.name}</span>
            <button
              type="button"
              className="fr-btn fr-icon-close-line fr-btn--tertiary-no-outline fr-btn--sm fr-ml-4v"
              aria-label={`Retirer le fichier ${file.file.name}`}
              onClick={() => onRemove(index)}
            />
          </UploadedFileRow>
        ))}
      </ul>
    </>
  )
}

export default DocumentUploader