import { prismaClient } from '@mss/web/prismaClient'
import { detailedDiff, DetailedDiff } from 'deep-object-diff'
import { removeNullUndefinedAndEmptyStringValues } from '@mss/web/utils/removeNullUndefinedAndEmptyStringValues'

export type MutationLogInfo = Pick<
  Exclude<
    Parameters<typeof prismaClient.mutationLog.create>[0],
    undefined
  >['data'],
  'targetUserId' | 'targetStructureId' | 'targetBeneficiaryId' | 'targetId'
>

export type MutationDiff = {
  [index in keyof DetailedDiff]: Record<string, unknown>
}

// Computes a added, updated and deleted diff between two inputs, considering that undefined and null are "deleted" values
export const computeMutationDiff = <T extends Object>(
  initialInput: T,
  input: T,
): MutationDiff => {
  const cleanInitial = removeNullUndefinedAndEmptyStringValues(initialInput)
  const cleanInput = removeNullUndefinedAndEmptyStringValues(input)
  const diff = detailedDiff(cleanInitial, cleanInput)

  // detailedDiff put undefined as a value for every deleted key.
  // we historize the deleted value instead, so the object is storable, instead of the keys
  // being removed by serialization process
  Object.keys(diff.deleted).forEach(
    (key) =>
      ((diff.deleted as Record<string, unknown>)[key] =
        (cleanInitial as Record<string, unknown>)[key] ?? null),
  )

  return diff as MutationDiff
}
