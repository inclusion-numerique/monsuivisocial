import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { BeneficiaryFormEdition } from '@mss/web/components/BeneficiaryForm'
import { PageConfig, PageTitle } from '@mss/web/components/PageTitle'
import { EditBeneficiaryFullDataClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.client'
import { EditBeneficiaryFullDataServer } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.server'
import { EditBeneficiaryGeneralInfoClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.client'
import { EditBeneficiaryGeneralInfoServer } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.server'
import { BeneficiairesQuery } from '@mss/web/server/query'
import { canUpdateBeneficiaryReferents } from '@mss/web/security/rules'
import { serialize } from '@mss/web/utils/serialization'
import { notFound } from 'next/navigation'

export const revalidate = 0

const EditBeneficiaryPage = async ({
  params: { fileNumber },
}: {
  params: RoutePathParams<
    typeof Routes.Beneficiaires.Beneficiaire.Modifier.path
  >
}) => {
  const user = await getAuthenticatedAgent()

  // TODO put this in feature file
  const beneficiary = await BeneficiairesQuery.getBeneficiaryToUpdate(
    fileNumber,
  )
  if (!beneficiary) {
    return notFound()
  }

  if (!EditBeneficiaryGeneralInfoClient.securityCheck(user, beneficiary, {})) {
    notFound()
  }

  const agentOptions = await BeneficiairesQuery.getAgentOptions(user)

  // NOTE: Could I have done this in BeneficiaryFormFields and keep secure ?
  const canUpdateReferents = canUpdateBeneficiaryReferents(user, beneficiary)

  // FIXME: Préparer la possibilité ou non de modifier pour les agents d'accueil ici.

  const formProperties = EditBeneficiaryFullDataClient.securityCheck(
    user,
    beneficiary,
    {},
  )
    ? await EditBeneficiaryFullDataServer.getServerState({
        beneficiaryId: beneficiary.id,
      }).then(
        (serverState) =>
          ({
            full: true,
            defaultInput:
              EditBeneficiaryFullDataServer.dataFromServerState(serverState),
          } as const),
      )
    : await EditBeneficiaryGeneralInfoServer.getServerState({
        beneficiaryId: beneficiary.id,
      }).then(
        (serverState) =>
          ({
            full: false,
            defaultInput:
              EditBeneficiaryGeneralInfoServer.dataFromServerState(serverState),
          } as const),
      )

  const page: PageConfig = {
    ...Routes.Beneficiaires.Beneficiaire.Modifier,
    title: Routes.Beneficiaires.Beneficiaire.Modifier.title(beneficiary),
  }

  return (
    <>
      <PageTitle
        page={page}
        parents={[
          Routes.Beneficiaires.Index,
          {
            title: Routes.Beneficiaires.Beneficiaire.Index.title(beneficiary),
            path: Routes.Beneficiaires.Beneficiaire.Index.path({
              fileNumber,
            }),
          },
        ]}
      />
      <div className="fr-grid-row fr-grid-row--center fr-pb-8v">
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <div className="fr-card">
            <div className="fr-card__body fr-py-8v">
              <BeneficiaryFormEdition
                full={formProperties.full}
                agentOptions={agentOptions}
                defaultInput={serialize(formProperties.defaultInput)}
                referentsDisabled={canUpdateReferents}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default EditBeneficiaryPage
