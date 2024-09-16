// TODO: Remplacer par un composant Alerte
export const FormError = ({ message }: { message: string | undefined }) => (
  <>{message ? <p className="fr-error-text">{message}</p> : ''}</>
)
