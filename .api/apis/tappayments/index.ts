import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'tappayments/1.0 (api/6.1.2)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * This endpoint returns a list of all previously created charges, with the most recent
   * charges appearing first.
   *
   * @summary List all Charges
   * @throws FetchError<400, types.ListAllChargesResponse400> 400
   */
  listAllCharges(body?: types.ListAllChargesBodyParam): Promise<FetchResponse<200, types.ListAllChargesResponse200>> {
    return this.core.fetch('/list', 'post', body);
  }

  /**
   * This endpoint initiates a charge request to charge a credit card or any other payment
   * source.
   *
   * @summary Create a Charge
   * @throws FetchError<400, types.CreateAChargeResponse400> 400
   */
  createACharge(body: types.CreateAChargeBodyParam): Promise<FetchResponse<200, types.CreateAChargeResponse200>> {
    return this.core.fetch('/', 'post', body);
  }

  /**
   * This endpoint retrieves the details of a charge that was previously created.
   *
   * @summary Retrieve a Charge
   */
  retrieveACharges(metadata: types.RetrieveAChargesMetadataParam): Promise<FetchResponse<200, types.RetrieveAChargesResponse200>> {
    return this.core.fetch('/{charge_id}', 'get', metadata);
  }

  /**
   * This endpoint updates the required details for a specified charge.
   *
   * @summary Update a Charge
   * @throws FetchError<400, types.UpdateAChargeResponse400> 400
   */
  updateACharge(body: types.UpdateAChargeBodyParam, metadata: types.UpdateAChargeMetadataParam): Promise<FetchResponse<200, types.UpdateAChargeResponse200>>;
  updateACharge(metadata: types.UpdateAChargeMetadataParam): Promise<FetchResponse<200, types.UpdateAChargeResponse200>>;
  updateACharge(body?: types.UpdateAChargeBodyParam | types.UpdateAChargeMetadataParam, metadata?: types.UpdateAChargeMetadataParam): Promise<FetchResponse<200, types.UpdateAChargeResponse200>> {
    return this.core.fetch('/{charge_id}', 'put', body, metadata);
  }

  /**
   * This endpoint allows you to retrieve a list of charges with detailed information for
   * each charge. The response returned can be saved in a CSV file. Each row represents a
   * charge with its respective details, and the first row contains the headers describing
   * each field.
   *
   * @summary Download Charges
   * @throws FetchError<400, types.DownloadChargesResponse400> 400
   */
  downloadCharges(body?: types.DownloadChargesBodyParam): Promise<FetchResponse<200, types.DownloadChargesResponse200>> {
    return this.core.fetch('/download', 'post', body);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { CreateAChargeBodyParam, CreateAChargeResponse200, CreateAChargeResponse400, DownloadChargesBodyParam, DownloadChargesResponse200, DownloadChargesResponse400, ListAllChargesBodyParam, ListAllChargesResponse200, ListAllChargesResponse400, RetrieveAChargesMetadataParam, RetrieveAChargesResponse200, UpdateAChargeBodyParam, UpdateAChargeMetadataParam, UpdateAChargeResponse200, UpdateAChargeResponse400 } from './types';
