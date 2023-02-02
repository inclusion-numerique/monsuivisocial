import { BreadCrumbParents, Breadcrumbs } from '@mss/web/ui/Breadcrumbs'
import { Routes } from '@mss/web/app/routing/routes'

export type PageConfig = {
  title: string
  icon: string
  breadcrumbsTitle?: string
}

export const PageTitle = ({
  page: { icon, title, breadcrumbsTitle },
  parents = [],
}: {
  page: PageConfig
  parents?: BreadCrumbParents
}) => {
  const breadcrumbsParents: BreadCrumbParents = [
    { title: 'Accueil', path: Routes.Structure.Index.path },
    ...parents,
  ]

  return (
    <>
      <Breadcrumbs
        hideRoot
        className="fr-mb-4v"
        currentPage={breadcrumbsTitle ?? title}
        parents={breadcrumbsParents}
      />
      <h2>
        <span className={`fr-icon-${icon} fr-icon--lg fr-mr-1w`} />
        {title}
      </h2>
    </>
  )
}