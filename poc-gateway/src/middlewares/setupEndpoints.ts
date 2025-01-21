import { initEndpoints } from '../routes'

/**
 * Loads the API endpoints for the backend API
 * There are some methods we want to ensure load before the endpoints are loaded
 * So We use dynamic import to ensure the endpoints are not loaded until setupEndpoints is called
 */
export const setupEndpoints = (): void => {
  initEndpoints()
}
