'use client'

import {
  InputFormField,
  SelectFormField,
  CheckboxFormField,
  SelectTagsFormField,
} from '@mss/web/components/FormField'
import {
  beneficiaryAccomodationModeOptions,
  beneficiaryFamilySituationOptions,
  beneficiaryGenderOptions,
  beneficiaryGirOptions,
  beneficiaryMobilityOptions,
  beneficiaryOrientationTypeOptions,
  beneficiaryProtectionMeasureOptions,
  beneficiarySocioProfessionalCategoryOptions,
  beneficiaryStatusOptions,
  beneficiaryTitleOptions,
  incomeSourceOptions,
  pensionOrganisationOptions,
} from '@mss/web/client/options/beneficiary'
import { nationalityOptions } from '@mss/web/client/options/nationality'
import { EditBeneficiaryFullDataClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.client'
import { Options } from '@mss/web/utils/options'
import { Control } from 'react-hook-form'

const FieldLabels = EditBeneficiaryFullDataClient.fieldLabels

// FIXME: Number input are not properly handled by Zod validation (the emitted value is a string)

export const BeneficiaryFormFields = ({
  disabled, // FIXME: Pas certains de l'accessibilité de désactiver tous les champs du formulaire. On peut seulement désactiver le bouton de soumission ?
  control,
  agentOptions,
  full,
  referentsDisabled,
}: {
  disabled: boolean
  control: Control<any, any>
  agentOptions: Options
  full: boolean
  referentsDisabled?: boolean
}) => (
  <div>
    <SelectTagsFormField
      label={FieldLabels.referents}
      disabled={disabled || !referentsDisabled}
      options={agentOptions}
      control={control}
      defaultOptionLabel="Choisissez un référent"
      defaultOption
      path="referents"
      required
    />
    <CheckboxFormField
      checkboxLabel={FieldLabels.aidantConnectAuthorized}
      disabled={disabled}
      control={control}
      path="aidantConnectAuthorized"
    />

    <section className="fr-accordion">
      <h3 className="fr-accordion__title">
        <button
          type="button"
          className="fr-accordion__btn"
          aria-expanded="false"
          aria-controls="beneficiary-form-general"
        >
          Informations générales
        </button>
      </h3>
      <div className="fr-collapse" id="beneficiary-form-general">
        <SelectFormField
          label={FieldLabels.status}
          path="status"
          disabled={disabled}
          control={control}
          options={beneficiaryStatusOptions}
          defaultOption
          required
        />
        <SelectFormField
          label={FieldLabels.title}
          path="title"
          disabled={disabled}
          control={control}
          options={beneficiaryTitleOptions}
          defaultOption
        />
        <InputFormField
          label={FieldLabels.usualName}
          path="usualName"
          disabled={disabled}
          control={control}
        />
        <InputFormField
          label={FieldLabels.birthName}
          path="birthName"
          disabled={disabled}
          control={control}
        />
        <InputFormField
          label={FieldLabels.firstName}
          path="firstName"
          disabled={disabled}
          control={control}
        />
        <InputFormField
          label={FieldLabels.birthDate}
          path="birthDate"
          type="date"
          valueAsDate
          disabled={disabled}
          control={control}
        />
        <InputFormField
          label={FieldLabels.birthPlace}
          path="birthPlace"
          disabled={disabled}
          control={control}
        />
        <SelectFormField
          label={FieldLabels.gender}
          path="gender"
          disabled={disabled}
          control={control}
          options={beneficiaryGenderOptions}
          defaultOption
        />
        <SelectFormField
          label={FieldLabels.nationality}
          path="nationality"
          disabled={disabled}
          control={control}
          options={nationalityOptions}
          defaultOption
        />
        <SelectFormField
          label={FieldLabels.accomodationMode}
          path="accomodationMode"
          disabled={disabled}
          control={control}
          options={beneficiaryAccomodationModeOptions}
          defaultOption
        />
        <InputFormField
          label={FieldLabels.accomodationAdditionalInformation}
          path="accomodationAdditionalInformation"
          hint="Bâtiment, immeuble, escalier et numéro d'appartement"
          disabled={disabled}
          control={control}
        />
        <InputFormField
          label={FieldLabels.zipcode}
          path="zipcode"
          disabled={disabled}
          control={control}
        />
        <InputFormField
          label={FieldLabels.city}
          path="city"
          disabled={disabled}
          control={control}
        />
        <InputFormField
          label={FieldLabels.region}
          path="region"
          disabled={disabled}
          control={control}
        />
        <InputFormField
          label={FieldLabels.streetNumber}
          path="streetNumber"
          disabled={disabled}
          control={control}
        />
        <InputFormField
          label={FieldLabels.street}
          path="street"
          disabled={disabled}
          control={control}
        />
        <CheckboxFormField
          label={FieldLabels.noPhone}
          path="noPhone"
          disabled={disabled}
          control={control}
        />
        <InputFormField
          label={FieldLabels.phone1}
          path="phone1"
          disabled={disabled}
          control={control}
        />
        <InputFormField
          label={FieldLabels.phone2}
          path="phone2"
          disabled={disabled}
          control={control}
        />
        <InputFormField
          label={FieldLabels.email}
          path="email"
          disabled={disabled}
          control={control}
        />
        <SelectFormField
          label={FieldLabels.familySituation}
          path="familySituation"
          disabled={disabled}
          control={control}
          options={beneficiaryFamilySituationOptions}
          defaultOption
        />
        <InputFormField
          label={FieldLabels.minorChildren}
          path="minorChildren"
          disabled={disabled}
          type="number"
          min={0}
          step={1}
          control={control}
        />
        <InputFormField
          label={FieldLabels.majorChildren}
          path="majorChildren"
          disabled={disabled}
          type="number"
          min={0}
          step={1}
          control={control}
        />
        <CheckboxFormField
          label={FieldLabels.caregiver}
          path="caregiver"
          disabled={disabled}
          control={control}
        />
        <SelectFormField
          label={FieldLabels.mobility}
          path="mobility"
          disabled={disabled}
          control={control}
          options={beneficiaryMobilityOptions}
          defaultOption
        />
      </div>
    </section>
    {full ? (
      <>
        <section className="fr-accordion">
          <h3 className="fr-accordion__title">
            <button
              type="button"
              className="fr-accordion__btn"
              aria-expanded="false"
              aria-controls="beneficiary-form-relatives"
            >
              Entourage
            </button>
          </h3>
          <div className="fr-collapse" id="beneficiary-form-relatives">
            <div className="fr-alert fr-alert--info">
              <p>Cette section est en cours de développement 🚧</p>
            </div>
          </div>
        </section>
        <section className="fr-accordion">
          <h3 className="fr-accordion__title">
            <button
              type="button"
              className="fr-accordion__btn"
              aria-expanded="false"
              aria-controls="beneficiary-form-health"
            >
              Santé
            </button>
          </h3>
          <div className="fr-collapse" id="beneficiary-form-health">
            <SelectFormField
              label={FieldLabels.gir}
              path="gir"
              disabled={disabled}
              control={control}
              options={beneficiaryGirOptions}
              defaultOption
            />
            <InputFormField
              label={FieldLabels.doctor}
              path="doctor"
              disabled={disabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels.healthAdditionalInformation}
              path="healthAdditionalInformation"
              disabled={disabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels.socialSecurityNumber}
              path="socialSecurityNumber"
              disabled={disabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels.insurance}
              path="insurance"
              disabled={disabled}
              control={control}
            />
          </div>
        </section>
        <section className="fr-accordion">
          <h3 className="fr-accordion__title">
            <button
              type="button"
              className="fr-accordion__btn"
              aria-expanded="false"
              aria-controls="beneficiary-form-activity"
            >
              Activité et revenu
            </button>
          </h3>
          <div className="fr-collapse" id="beneficiary-form-activity">
            <SelectFormField
              label={FieldLabels.socioProfessionalCategory}
              path="socioProfessionalCategory"
              disabled={disabled}
              control={control}
              options={beneficiarySocioProfessionalCategoryOptions}
              defaultOption
            />
            <InputFormField
              label={FieldLabels.occupation}
              path="occupation"
              disabled={disabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels.employer}
              path="employer"
              disabled={disabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels.employerSiret}
              path="employerSiret"
              disabled={disabled}
              control={control}
            />
            <SelectTagsFormField
              label={FieldLabels.mainIncomeSource}
              path="mainIncomeSource"
              disabled={disabled}
              control={control}
              options={incomeSourceOptions}
              defaultOption
            />
            <InputFormField
              label={FieldLabels.mainIncomeAmount}
              path="mainIncomeAmount"
              disabled={disabled}
              control={control}
              type="number"
              min={0}
            />
            <InputFormField
              label={FieldLabels.unemploymentNumber}
              path="unemploymentNumber"
              disabled={disabled}
              control={control}
            />
            <SelectTagsFormField
              label={FieldLabels.pensionOrganisations}
              disabled={disabled}
              options={pensionOrganisationOptions}
              control={control}
              defaultOption
              path="pensionOrganisations"
            />
            <InputFormField
              label={FieldLabels.cafNumber}
              path="cafNumber"
              disabled={disabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels.bank}
              path="bank"
              disabled={disabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels.funeralContract}
              path="funeralContract"
              disabled={disabled}
              control={control}
            />
          </div>
        </section>
        <section className="fr-accordion">
          <h3 className="fr-accordion__title">
            <button
              type="button"
              className="fr-accordion__btn"
              aria-expanded="false"
              aria-controls="beneficiary-form-external"
            >
              Structures extérieures
            </button>
          </h3>
          <div className="fr-collapse" id="beneficiary-form-external">
            <SelectFormField
              label={FieldLabels.protectionMeasure}
              path="protectionMeasure"
              disabled={disabled}
              control={control}
              options={beneficiaryProtectionMeasureOptions}
              defaultOption
            />
            <InputFormField
              label={FieldLabels.representative}
              path="representative"
              disabled={disabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels.prescribingStructure}
              path="prescribingStructure"
              disabled={disabled}
              control={control}
            />
            <SelectFormField
              label={FieldLabels.orientationType}
              path="orientationType"
              disabled={disabled}
              control={control}
              options={beneficiaryOrientationTypeOptions}
              defaultOption
            />
            <InputFormField
              label={FieldLabels.orientationStructure}
              path="orientationStructure"
              disabled={disabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels.serviceProviders}
              hint="Repas à domicile, aide à domicile, ..."
              path="cafNumber"
              disabled={disabled}
              control={control}
            />
            <InputFormField
              label={FieldLabels.involvedPartners}
              path="involvedPartners"
              disabled={disabled}
              control={control}
            />
          </div>
        </section>
      </>
    ) : null}

    <InputFormField
      className="fr-mt-4v"
      label={FieldLabels.additionalInformation}
      hint="Il est fortement recommandé de ne stocker que les informations utiles au suivi du bénéficiaire et d'éviter le recueil d'informations sensibles (données de santé, mots de passe, etc)."
      disabled={disabled}
      control={control}
      path="additionalInformation"
      type="textarea"
    />
  </div>
)
