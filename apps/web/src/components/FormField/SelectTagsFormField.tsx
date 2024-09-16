'use client'

import { Control, Controller, FieldValues } from 'react-hook-form'
import { FieldPath } from 'react-hook-form/dist/types/path'
import { Option, Options, OptionsGroups } from '@mss/web/utils/options'
import { ChangeEventHandler, MouseEventHandler } from 'react'

function OptionsList({ options }: { options: Options }) {
  return (
    <>
      {options.map(({ name, value }) => (
        <option key={value} value={value}>
          {name}
        </option>
      ))}
      )
    </>
  )
}

// View design options here https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/liste-deroulante/
export function SelectTagsFormField<T extends FieldValues>({
  control,
  label,
  path,
  placeholder,
  hint,
  defaultOption,
  disabled,
  required,
  autoFocus,
  defaultOptionLabel = 'Sélectionnez une option',
  badgeSize,
  ...optionsProperties
}: {
  control: Control<T>
  label?: string
  path: FieldPath<T>
  disabled?: boolean
  required?: boolean
  defaultOption?: boolean
  defaultOptionLabel?: string
  hint?: string
  placeholder?: string
  autoFocus?: boolean
  badgeSize?: 'sm' | 'md'
} & (
  | { groups?: false; options: Options }
  | { groups: true; optionGroups: OptionsGroups }
)) {
  const id = `select-tags-form-field__${path}`

  const flattenedOptions: Options = optionsProperties.groups
    ? Object.values(optionsProperties.optionGroups).flat()
    : optionsProperties.options

  // TODO Aria labeled by from id
  return (
    <Controller
      control={control}
      name={path}
      /**
       * This is set to prevent disabled Controller to be submitted (= native
       * inputs behavior). The `any` cast is required due to Controller not
       * defining disabled.
       * https://github.com/react-hook-form/react-hook-form/issues/2655#issuecomment-1251171110
       */
      rules={{ disabled } as any}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, error },
      }) => {
        // We will remove already selected options from the select options
        const valuesSet = new Set<string>(value ?? [])

        const onSelectChange: ChangeEventHandler<HTMLSelectElement> = (
          event,
        ) => {
          onChange(
            value ? [...value, event.target.value] : [event.target.value],
          )
        }

        const selectedOptions = flattenedOptions.filter((option) =>
          value?.includes(option.value),
        )

        // Remove value on badge click
        const onTagClick = (option: Option) => {
          onChange(
            value.filter(
              (selectedValue: string) => selectedValue !== option.value,
            ),
          )
        }

        return (
          <div
            className={`fr-select-group ${
              error ? 'fr-select-group--error' : ''
            } ${disabled ? 'fr-select-group--disabled' : ''} ${
              isTouched && !invalid ? 'fr-select-group--valid' : ''
            }`}
          >
            <label className="fr-label" htmlFor={id}>
              {label}
              {required ? ' *' : null}
              {hint ? <span className="fr-hint-text">{hint}</span> : null}
            </label>
            <select
              className="fr-select fr-select--error"
              aria-describedby="text-select-error-desc-error"
              id={id}
              placeholder={placeholder}
              disabled={disabled}
              onBlur={onBlur}
              onChange={onSelectChange}
              value=""
              ref={ref}
              name={name}
              autoFocus={autoFocus}
            >
              {defaultOption ? (
                <option value="">{defaultOptionLabel}</option>
              ) : null}
              {optionsProperties.groups ? (
                Object.entries(optionsProperties.optionGroups).map(
                  ([groupLabel, options]) => {
                    const availableOptions = options.filter(
                      ({ value }) => !valuesSet.has(value),
                    )
                    if (availableOptions.length === 0) {
                      return null
                    }
                    return (
                      <optgroup key={groupLabel} label={groupLabel}>
                        <OptionsList options={availableOptions} />
                      </optgroup>
                    )
                  },
                )
              ) : (
                <OptionsList
                  options={optionsProperties.options.filter(
                    ({ value }) => !valuesSet.has(value),
                  )}
                />
              )}
            </select>
            <div className="fr-mt-4v">
              {selectedOptions.map((option) => (
                <OptionBadge
                  key={option.value}
                  option={option}
                  disabled={disabled}
                  size={badgeSize}
                  onClick={() => onTagClick(option)}
                />
              ))}
            </div>
            {error ? (
              <p id={`${id}__error`} className="fr-error-text">
                {error.message}
              </p>
            ) : null}
          </div>
        )
      }}
    />
  )
}

function OptionBadge({
  option,
  onClick,
  disabled,
  size,
}: {
  option: Option
  onClick: MouseEventHandler
  disabled?: boolean
  size?: 'sm' | 'md'
}) {
  return (
    <button
      type="button"
      className={`fr-tag fr-mr-1w fr-mb-2v ${
        size === 'sm' ? 'fr-tag--sm' : ''
      }`}
      disabled={disabled || option.disabled}
      onClick={disabled ? undefined : onClick}
      aria-label={`Retirer ${option.name}`}
    >
      {option.name}
      <span className="fr-icon-close-line fr-ml-1w fr-icon--sm" />
    </button>
  )
}
