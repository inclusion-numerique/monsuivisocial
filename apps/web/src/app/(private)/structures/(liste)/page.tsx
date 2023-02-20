import { PageTitle } from '@mss/web/app/(private)/PageTitle'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { canListStructures } from '@mss/web/security/rules'
import { notFound, redirect } from 'next/navigation'
import {
  getColumnOrderBy,
  Sorting,
} from '@mss/web/ui/table/TableColumnDefinition'
import { ListStructuresServer } from '@mss/web/features/structure/listStructures/listStructures.server'
import { createPageLinkHelper } from '@mss/web/ui/pagination'
import { createSortLinkHelper } from '@mss/web/ui/sorting'
import { TableHeadWithSorting } from '@mss/web/ui/table/TableHeadWithSorting'
import { structuresListTableColumns } from '@mss/web/app/(private)/structures/(liste)/structuresListTableColumns'
import { StructuresListTableRows } from '@mss/web/app/(private)/structures/(liste)/StructuresListTableRows'
import { Table } from '@mss/web/ui/table/Table'
import Link from 'next/link'

const itemsPerPage = 15

const defaultSorting: Sorting = {
  by: 'Nom',
  direction: 'asc',
}

const StructuresListPage = async ({
  searchParams,
}: {
  searchParams?: RoutePathParams<typeof Routes.Structures.Index.pathWithParams>
}) => {
  const user = await getAuthenticatedAgent()
  if (!canListStructures(user)) {
    notFound()
    return null
  }

  // TODO We could put all this in a big list page helper function...

  // Get pagination and sorting info from searchParams
  const pageNumber = searchParams?.page ? parseInt(searchParams.page) : 1
  const currentSorting: Sorting = {
    by: searchParams?.tri ?? defaultSorting.by,
    direction: searchParams?.ordre ?? defaultSorting.direction,
  }

  // Get filters info from searchParams
  const search = searchParams?.recherche

  const { structures, totalPages, count } = await ListStructuresServer.execute({
    user,
    input: {
      perPage: itemsPerPage,
      page: pageNumber,
      orderBy: getColumnOrderBy(currentSorting, structuresListTableColumns),
      search,
    },
    securityParams: {},
  })

  // Linking logic for pages navigation
  const createPageLink = createPageLinkHelper(
    { currentSorting, defaultSorting, search },
    Routes.Structures.Index.pathWithParams,
  )

  // Redirect to last page if pageNumber is outside of bounds
  if (pageNumber > totalPages) {
    redirect(createPageLink(totalPages))
    return null
  }

  // Linking logic for sorting
  const createSortLink = createSortLinkHelper(
    { pageNumber, defaultSorting, search },
    Routes.Structures.Index.pathWithParams,
  )

  const tableHead = (
    <TableHeadWithSorting
      columns={structuresListTableColumns}
      createSortLink={createSortLink}
      currentSorting={currentSorting}
    />
  )

  const tableBody = <StructuresListTableRows structures={structures} />

  return (
    <>
      <PageTitle page={Routes.Structures.Index} />
      <div className="fr-card fr-mt-4v">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="fr-hint-text fr-mb-0">
                {count} structure
                {count === 1 ? '' : 's'}
              </p>
              <Link
                className="fr-btn fr-btn--icon-left fr-icon-building-line fr-mb-0"
                href={Routes.Structures.Ajouter.path}
              >
                Ajouter une structure
              </Link>
            </div>

            <Table
              tableHead={tableHead}
              tableBody={tableBody}
              pagination={{
                pageNumber,
                totalPages,
                createPageLink,
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default StructuresListPage