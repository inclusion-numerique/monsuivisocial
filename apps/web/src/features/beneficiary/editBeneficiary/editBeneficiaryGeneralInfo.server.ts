import { createMutationServerWithInitialState } from '@mss/web/features/createMutation.server'
import { EditBeneficiaryGeneralInfoClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.client'
import { prismaClient } from '@mss/web/server/prisma/prismaClient'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { removeNullAndUndefinedValues } from '@mss/web/utils/removeNullAndUndefinedValues'
import { Nationalities } from '@mss/web/client/options/nationality'

export const EditBeneficiaryGeneralInfoServer =
  createMutationServerWithInitialState({
    client: EditBeneficiaryGeneralInfoClient,
    getServerState: async ({ beneficiaryId }: { beneficiaryId: string }) =>
      prismaClient.beneficiary.findUniqueOrThrow({
        where: { id: beneficiaryId },
        // Only select general info
        select: {
          referents: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              name: true,
              role: true,
            },
          },
          id: true,
          structureId: true,
          aidantConnectAuthorized: true,
          status: true,
          title: true,
          usualName: true,
          birthName: true,
          firstName: true,
          birthDate: true,
          birthPlace: true,
          gender: true,
          nationality: true,
          accomodationMode: true,
          accomodationAdditionalInformation: true,
          city: true,
          zipcode: true,
          region: true,
          streetNumber: true,
          street: true,
          addressComplement: true,
          noPhone: true,
          phone1: true,
          phone2: true,
          email: true,
          familySituation: true,
          minorChildren: true,
          majorChildren: true,
          caregiver: true,
          mobility: true,
          additionalInformation: true,
        },
      }),
    dataFromServerState: ({
      id,
      referents,
      nationality,
      ...data
    }): MutationInput<EditBeneficiaryGeneralInfoClient> => ({
      beneficiaryId: id,
      nationality: nationality as keyof typeof Nationalities,
      referents: referents.map((referent) => referent.id),
      ...removeNullAndUndefinedValues(data),
    }),
    executeMutation: async ({ input, transaction, initialInput, user }) => {
      // FIXME: data contient aussi les données qui n'ont pas changé ? Dans ce cas là
      const { beneficiaryId, structureId, ...data } = input

      const beneficiary = await transaction.beneficiary.update({
        where: { id: beneficiaryId },
        data: {
          updated: new Date(),
          ...data,
        },
      })

      return { beneficiary }
    },
    mutationLogInfo: ({
      input: { beneficiaryId },
      result: {
        beneficiary: { structureId },
      },
    }) => ({
      targetId: beneficiaryId,
      targetStructureId: structureId,
      targetBeneficiaryId: beneficiaryId,
    }),
  })

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EditBeneficiaryGeneralInfoServer =
  typeof EditBeneficiaryGeneralInfoServer
