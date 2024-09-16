'use client'

import {
  InputFormField,
  SelectFormField,
  CheckboxFormField,
  SelectTagsFormField,
} from '@mss/web/components/FormField'
import {
  beneficiaryGenderOptions,
  beneficiaryTitleOptions,
} from '@mss/web/client/options/beneficiary'
import { EditBeneficiaryFullDataClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.client'
import { Options } from '@mss/web/utils/options'
import { Control } from 'react-hook-form'

const FieldLabels = EditBeneficiaryFullDataClient.fieldLabels

export const BeneficiaryFormCreationFields = ({
  disabled,
  control,
  agentOptions,
}: {
  disabled: boolean
  control: Control<any, any>
  agentOptions: Options
}) => (
  <div>
    <SelectTagsFormField
      label={FieldLabels.referents}
      disabled={disabled}
      options={agentOptions}
      control={control}
      defaultOptionLabel="Choisissez un référent"
      defaultOption
      path="referents"
      required
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
    <CheckboxFormField
      checkboxLabel={FieldLabels.aidantConnectAuthorized}
      disabled={disabled}
      control={control}
      path="aidantConnectAuthorized"
    />
  </div>
)
