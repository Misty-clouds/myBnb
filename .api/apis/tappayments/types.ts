import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type CreateAChargeBodyParam = FromSchema<typeof schemas.CreateACharge.body>;
export type CreateAChargeResponse200 = FromSchema<typeof schemas.CreateACharge.response['200']>;
export type CreateAChargeResponse400 = FromSchema<typeof schemas.CreateACharge.response['400']>;
export type DownloadChargesBodyParam = FromSchema<typeof schemas.DownloadCharges.body>;
export type DownloadChargesResponse200 = FromSchema<typeof schemas.DownloadCharges.response['200']>;
export type DownloadChargesResponse400 = FromSchema<typeof schemas.DownloadCharges.response['400']>;
export type ListAllChargesBodyParam = FromSchema<typeof schemas.ListAllCharges.body>;
export type ListAllChargesResponse200 = FromSchema<typeof schemas.ListAllCharges.response['200']>;
export type ListAllChargesResponse400 = FromSchema<typeof schemas.ListAllCharges.response['400']>;
export type RetrieveAChargesMetadataParam = FromSchema<typeof schemas.RetrieveACharges.metadata>;
export type RetrieveAChargesResponse200 = FromSchema<typeof schemas.RetrieveACharges.response['200']>;
export type UpdateAChargeBodyParam = FromSchema<typeof schemas.UpdateACharge.body>;
export type UpdateAChargeMetadataParam = FromSchema<typeof schemas.UpdateACharge.metadata>;
export type UpdateAChargeResponse200 = FromSchema<typeof schemas.UpdateACharge.response['200']>;
export type UpdateAChargeResponse400 = FromSchema<typeof schemas.UpdateACharge.response['400']>;
