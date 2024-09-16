import { protectedProcedure, router } from '@mss/web/server/createRouter'
import z from 'zod'
import {
  BeneficiaryStatus,
  prismaClient,
} from '@mss/web/server/prisma/prismaClient'
import { EditBeneficiaryGeneralInfoClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.client'
import { getBeneficiarySecurityTarget } from '@mss/web/security/getBeneficiarySecurityTarget'
import { forbiddenError, invalidError } from '@mss/web/server/trpcErrors'
import { EditBeneficiaryGeneralInfoServer } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.server'
import { EditBeneficiaryFullDataClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.client'
import { EditBeneficiaryFullDataServer } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.server'
import { ArchiveBeneficiaryClient } from '@mss/web/features/beneficiary/archiveBeneficiary/archiveBeneficiary.client'
import { ArchiveBeneficiaryServer } from '@mss/web/features/beneficiary/archiveBeneficiary/archiveBeneficiary.server'
import {
  canListBeneficiaries,
  canUpdateBeneficiaryReferents,
} from '@mss/web/security/rules'
import { beneficiaryDocumentRouter } from '@mss/web/server/routers/beneficiaryDocumentRouter'
import { createBeneficiarySchema } from '@mss/web/server/schema'
import { createBeneficiaryHandler } from '../controller/beneficiary.controller'

const tokenToSearchCondition = (token: string) => ({
  contains: token,
  mode: 'insensitive',
})
export const beneficiaryRouter = router({
  search: protectedProcedure
    .input(z.object({ query: z.string(), structureId: z.string().uuid() }))
    .query(async ({ input: { query, structureId }, ctx: { user } }) => {
      if (!canListBeneficiaries(user, { structureId })) {
        throw forbiddenError()
      }
      // TODO unit test
      const tokens = query.trim().replace(/%/g, '').split(/\s+/g)

      const fields = [
        'firstName',
        'birthName',
        'usualName',
        'fileNumber',
      ] as const

      const searchConditions = tokens.map((token) => ({
        OR: fields.map((field) => ({
          [field]: tokenToSearchCondition(token),
        })),
      }))

      // TODO benchmark this and stress tes, then create indexes for case-insensitive filtering.
      // TODO check pg_trgm https://www.postgresql.org/docs/12/pgtrgm.html#id-1.11.7.40.7 for indexing
      const beneficiaries = await prismaClient.beneficiary.findMany({
        where: {
          structureId,
          archived: null,
          AND: searchConditions,
        },
        orderBy: [{ usualName: 'asc' }, { birthName: 'asc' }],
        select: {
          id: true,
          usualName: true,
          firstName: true,
          birthName: true,
          fileNumber: true,
        },
      })

      return { beneficiaries }
    }),
  create: protectedProcedure
    .input(createBeneficiarySchema)
    .mutation(async ({ input, ctx: { user } }) =>
      createBeneficiaryHandler({ input, user }),
    ),
  editGeneralInfo: protectedProcedure
    .input(EditBeneficiaryGeneralInfoClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const target = await getBeneficiarySecurityTarget(input.beneficiaryId)
      if (!target) {
        throw invalidError('Beneficiary not found')
      }

      // FIXME: It should only be done if referents are present in the diff
      if (
        !canUpdateBeneficiaryReferents(user, target) &&
        input.referents?.length
      ) {
        throw forbiddenError(
          'You do not have rights to edit the beneficiary referents',
        )
      }

      return EditBeneficiaryGeneralInfoServer.execute({
        input,
        user,
        getServerStateInput: input,
        target,
        securityParams: {},
        beneficiaryId: input.beneficiaryId,
      })
    }),
  editFullData: protectedProcedure
    .input(EditBeneficiaryFullDataClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const target = await getBeneficiarySecurityTarget(input.beneficiaryId)
      if (!target) {
        throw invalidError('Beneficiary not found')
      }

      // FIXME: It should only be done if referents are present in the diff
      if (!canUpdateBeneficiaryReferents(user, target)) {
        throw forbiddenError(
          'You do not have rights to edit the beneficiary referents',
        )
      }

      return EditBeneficiaryFullDataServer.execute({
        input,
        user,
        target,
        securityParams: {},
        getServerStateInput: input,
        beneficiaryId: input.beneficiaryId,
      })
    }),
  archive: protectedProcedure
    .input(ArchiveBeneficiaryClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const beneficiary = await getBeneficiarySecurityTarget(
        input.beneficiaryId,
      )
      if (!beneficiary) {
        throw invalidError('Bénéficiaire introuvable')
      }

      return ArchiveBeneficiaryServer.execute({
        input,
        user,
        target: beneficiary,
        getServerStateInput: input,
        securityParams: {},
        structureId: beneficiary.structureId,
        beneficiaryId: input.beneficiaryId,
      })
    }),
  document: beneficiaryDocumentRouter,
})
