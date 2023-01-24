import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/app/structure/PageLoading'
import { loadingBeneficiary } from '@mss/web/app/structure/beneficiaires/loadingBeneficiary'

const Loading = () => (
  <PageLoading
    page={{
      ...Routes.Structure.Beneficiaires.Beneficiaire.Modifier,
      title:
        Routes.Structure.Beneficiaires.Beneficiaire.Modifier.title(
          loadingBeneficiary,
        ),
    }}
    parents={[
      Routes.Structure.Beneficiaires.Index,
      {
        title:
          Routes.Structure.Beneficiaires.Beneficiaire.Index.title(
            loadingBeneficiary,
          ),
        path: Routes.Structure.Beneficiaires.Beneficiaire.Index.path(
          loadingBeneficiary,
        ),
      },
    ]}
  />
)

export default Loading
