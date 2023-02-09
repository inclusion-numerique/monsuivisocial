import { canCreateBeneficiaryHelpRequest } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import {
  HelpRequestReason,
  HelpRequestStatus,
  PaymentMethod,
} from '@prisma/client'

export const AddHelpRequestClient = createMutationClient({
  name: 'helpRequest.add',
  securityCheck: canCreateBeneficiaryHelpRequest,
  inputValidation: z.object({
    structureId: z.string().uuid(),
    beneficiaryId: z.string().uuid(),
    openingDate: z.string().datetime(),
    type: z.string().uuid(),
    documents: z.array(z.string().uuid()).default([]),
    financialSupport: z.boolean().default(false),
    externalStructure: z.boolean().default(false),
    status: z.nativeEnum(HelpRequestStatus),
    askedAmount: z.number().min(0).optional(),
    examinationDate: z.string().datetime().optional(),
    decisionDate: z.string().datetime().optional(),
    allocatedAmount: z.number().min(0).optional(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    reason: z.nativeEnum(HelpRequestReason),
    paymentDate: z.string().datetime().optional(),
    handlingDate: z.string().datetime().optional(),
    refusalReason: z.string().optional(),
    prescribingOrganisation: z.string().optional(),
    examiningOrganisation: z.string().optional(),
    dispatchDate: z.string().datetime().optional(),
    synthesis: z.string().optional(),
    privateSynthesis: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    fullFile: z.boolean().default(false),
  }),
  // TODO anonymize all identification fields from above
  beneficiaryAnonymization: ({ ...data }) => ({
    refusalReason: '',
    syntesis: '',
    privateSynthesis: '',
  }),
  fieldLabels: {
    structureId: 'Structure',
    beneficiaryId: 'Bénéficiaire',
    type: 'Accompagnement',
    openingDate: "Date d'ouverture du dossier",
    prescribingOrganisation: 'Organisme prescripteur',
    status: 'Statut',
    fullFile: 'Dossier complet',
    financialSupport: "S'agit-il d'une aide financière ?",
    reason: "Motif de l'aide financière",
    externalStructure: "L'instruction de la demande est réalisée...",
    dueDate: "Date d'échéance",
    documents: 'Documents',
    examiningOrganisation: 'Organisme instructeur',
    askedAmount: 'Montant demandé',
    examinationDate: 'Date de passage en commission',
    refusalReason: 'Motif du refus',
    decisionDate: 'Date de la décision',
    allocatedAmount: 'Montant attribué',
    paymentMethod: 'Mode de paiement',
    paymentDate: 'Date du paiement',
    handlingDate: 'Date de fin de prise en charge',
    dispatchDate: "Date d'envoi du dossier",
    synthesis: 'Compte rendu',
    privateSynthesis: 'Compte rendu privé',
  },
})

export type AddHelpRequestClient = typeof AddHelpRequestClient