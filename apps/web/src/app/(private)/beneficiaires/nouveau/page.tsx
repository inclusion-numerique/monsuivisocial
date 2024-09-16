import { Routes } from '@mss/web/app/routing/routes'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { BeneficiaryFormCreation } from '@mss/web/components/BeneficiaryFormCreation'
import { PageTitle } from '@mss/web/components/PageTitle'
import { BeneficiairesQuery } from '@mss/web/server/query'

const AddBeneficiaryPage = async () => {
  const user = await getAuthenticatedAgent()
  const agentOptions = await BeneficiairesQuery.getAgentOptions(user)
  const { structureId } = user

  return (
    <>
      <PageTitle
        page={Routes.Beneficiaires.Nouveau}
        parents={[Routes.Beneficiaires.Index]}
      />
      <div className="fr-grid-row fr-grid-row--center fr-pb-8v">
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <div className="fr-card">
            <div className="fr-card__body fr-py-8v">
              <BeneficiaryFormCreation
                agentOptions={agentOptions}
                structureId={structureId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default AddBeneficiaryPage
