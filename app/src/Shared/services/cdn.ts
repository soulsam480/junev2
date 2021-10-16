import { api } from 'src/utils/helpers';
import { ResponseSchema } from 'src/utils/types';

export function uploadImage(file: FormData, scope?: string) {
  return api.post<ResponseSchema<{ key?: string }>>(`/cdn`, file, { params: { scope } });
}
