import { createMutationServerWithInitialState } from '@mss/web/features/createMutation.server'
import { EditHelpRequestClient } from '@mss/web/features/helpRequest/editHelpRequest.client'
import { prismaClient } from '@mss/web/prismaClient'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { removeNullAndUndefinedValues } from '@mss/web/utils/removeNullAndUndefinedValues'
import { computeArrayDiff } from '@mss/web/utils/diff'
import { booleanToString, stringToBoolean } from '@mss/web/utils/booleanString'

export const EditHelpRequestServer = createMutationServerWithInitialState({
  client: EditHelpRequestClient,
  getServerState: async ({ helpRequestId }: { helpRequestId: string }) =>
    prismaClient.helpRequest.findUniqueOrThrow({
      where: { id: helpRequestId },
      // Only select general info
      include: {
        type: true,
        documents: true,
      },
    }),
  dataFromServerState: ({
    id,
    type,
    documents,
    openingDate,
    examinationDate,
    decisionDate,
    paymentDate,
    handlingDate,
    dispatchDate,
    dueDate,
    financialSupport,
    externalStructure,
    askedAmount,
    allocatedAmount,
    created,
    updated,
    createdById,
    ...data
  }): MutationInput<EditHelpRequestClient> => {
    return {
      helpRequestId: id,
      type: type.id,
      documents: documents.map(({ key }) => key),
      financialSupport: booleanToString(financialSupport) ?? undefined,
      externalStructure: booleanToString(externalStructure) ?? undefined,
      // TODO helper to cast all optional dates to isostrings?
      openingDate: openingDate?.toISOString(),
      examinationDate: examinationDate?.toISOString(),
      decisionDate: decisionDate?.toISOString(),
      paymentDate: paymentDate?.toISOString(),
      handlingDate: handlingDate?.toISOString(),
      dispatchDate: dispatchDate?.toISOString(),
      dueDate: dueDate?.toISOString(),
      askedAmount: askedAmount?.toNumber(),
      allocatedAmount: allocatedAmount?.toNumber(),
      ...removeNullAndUndefinedValues(data),
    }
  },
  executeMutation: async ({ input, transaction, initialInput }) => {
    const {
      helpRequestId,
      beneficiaryId,
      type,
      documents,
      financialSupport,
      externalStructure,
      ...data
    } = input

    const documentsDiff = computeArrayDiff(
      initialInput.documents,
      input.documents,
    )

    const helpRequest = await transaction.helpRequest.update({
      where: { id: helpRequestId },
      data: {
        updated: new Date(),
        typeId: type,
        financialSupport: stringToBoolean(financialSupport),
        externalStructure: stringToBoolean(externalStructure),
        documents: {
          connect: documentsDiff.added.map((key) => ({ key })),
          disconnect: documentsDiff.removed.map((key) => ({ key })),
        },
        ...data,
      },
      include: {
        beneficiary: {
          select: {
            id: true,
            fileNumber: true,
          },
        },
      },
    })

    return { helpRequest }
  },
  mutationLogInfo: ({
    input: { beneficiaryId, helpRequestId },
    result: {
      helpRequest: { structureId },
    },
  }) => ({
    targetId: helpRequestId,
    targetStructureId: structureId,
    targetBeneficiaryId: beneficiaryId,
  }),
})

export type EditHelpRequestServer = typeof EditHelpRequestServer
