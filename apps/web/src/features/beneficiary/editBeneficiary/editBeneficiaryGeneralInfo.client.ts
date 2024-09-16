import { canEditBeneficiaryGeneralInfo } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { AddBeneficiaryWithGeneralInfoClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.client'

export const EditBeneficiaryGeneralInfoClient = createMutationClient({
  name: 'beneficiary.editGeneralInfo',
  title: 'Modification de bénéficiaire',
  securityCheck: canEditBeneficiaryGeneralInfo,
  inputValidation: AddBeneficiaryWithGeneralInfoClient.inputValidation
    .extend({
      beneficiaryId: z.string().uuid(),
    })
    .omit({ referents: true }), // FIXME: Would be nice to base it on canUpdateBeneficiaryReferents if possible. Otherwise, GeneralInfo = formulaire d'agent d'accueil
  beneficiaryAnonymization:
    AddBeneficiaryWithGeneralInfoClient.beneficiaryAnonymization,
  fieldLabels: {
    beneficiaryId: 'Identifiant',
    ...AddBeneficiaryWithGeneralInfoClient.fieldLabels,
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EditBeneficiaryGeneralInfoClient =
  typeof EditBeneficiaryGeneralInfoClient
