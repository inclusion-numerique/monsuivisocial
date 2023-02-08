import { canCreateBeneficiaryWithGeneralInfo } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import {
  BeneficiaryAccomodationMode,
  BeneficiaryFamilySituation,
  BeneficiaryMobility,
  BeneficiaryStatus,
  BeneficiaryTitle,
  Gender,
} from '@prisma/client'
import { Nationalities } from '@mss/web/features/beneficiary/nationality'

export const AddBeneficiaryWithGeneralInfoClient = createMutationClient({
  name: 'beneficiary.addWithGeneralInfo',
  securityCheck: canCreateBeneficiaryWithGeneralInfo,
  inputValidation: z.object({
    // General information
    structureId: z.string().uuid(),
    referents: z
      .array(z.string().uuid())
      .min(1, 'Veuillez renseigner au moins un agent référent'),
    aidantConnectAuthorized: z.boolean().default(false),
    status: z.nativeEnum(BeneficiaryStatus),
    title: z.nativeEnum(BeneficiaryTitle).optional(),
    firstName: z.string().optional(),
    usualName: z.string().optional(),
    birthName: z.string().optional(),
    birthDate: z.string().datetime().optional(),
    birthPlace: z.string().optional(),
    deathDate: z.date().optional(),
    gender: z.nativeEnum(Gender).optional(),
    nationality: z.nativeEnum(Nationalities).optional(),
    accomodationMode: z.nativeEnum(BeneficiaryAccomodationMode).optional(),
    accomodationName: z.string().optional(),
    accomodationAdditionalInformation: z.string().optional(),
    street: z.string().optional(),
    streetNumber: z.string().optional(),
    addressComplement: z.string().optional(),
    zipcode: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    noPhone: z.boolean().default(false),
    phone1: z.string().optional(),
    phone2: z.string().optional(),
    email: z.string().email().optional(),
    familySituation: z.nativeEnum(BeneficiaryFamilySituation).optional(),
    caregiver: z.boolean().default(false),
    minorChildren: z.number().int().gte(0).optional(),
    majorChildren: z.number().int().gte(0).optional(),
    mobility: z.nativeEnum(BeneficiaryMobility).optional(),
    administration: z.string().optional(),
    minister: z.string().optional(),

    // Additional info
    additionalInformation: z.string().optional(),
  }),
  // TODO anonymize all identification fields from above
  beneficiaryAnonymization: ({ firstName, structureId }) => ({
    structureId,
    firstName: '',
  }),
  fieldLabels: {
    structureId: 'Structure',
    referents: 'Agent(s) référent(s)',
    aidantConnectAuthorized: 'Mandat Aidant Connect',
    status: 'Statut du dossier',
    title: 'Civilité',
    usualName: 'Nom usuel',
    birthName: 'Nom de naissance',
    firstName: 'Prénom(s)',
    birthDate: 'Date de naissance',
    birthPlace: 'Lieu de naissance',
    gender: 'Genre',
    nationality: 'Nationalité',
    accomodationMode: "Mode d'hébergement",
    accomodationAdditionalInformation: 'Précisions hébergement',
    city: 'Ville',
    zipcode: 'Code postal',
    region: 'Région',
    streetNumber: 'Numéro de rue',
    street: 'Nom de la rue',
    addressComplement: "Complément d'adresse",
    noPhone: "N'a pas de téléphone",
    phone1: 'Téléphone 1',
    phone2: 'Téléphone 2',
    email: 'Email',
    familySituation: 'Situation familiale',
    minorChildren: "Nombre d'enfant(s) mineur(s)",
    majorChildren: "Nombre d'enfant(s) majeur(s)",
    caregiver: 'Aidant familial',
    mobility: 'Données mobilité',
    additionalInformation: 'Informations complémentaires',
  },
})

export type AddBeneficiaryWithGeneralInfoClient =
  typeof AddBeneficiaryWithGeneralInfoClient
