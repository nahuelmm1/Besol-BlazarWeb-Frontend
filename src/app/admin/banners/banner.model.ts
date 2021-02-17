import { ISerializable } from '../../core/serialization/iserializable';

export class BannerModel implements ISerializable<BannerModel> {
  bannerMainId: number;
  imagenPath: string;
  titulo: string;
  subTitulo: string;
  posicionX: string;
  posicionY: string;
  alineadoIzquierda: boolean;
  anchoSubtitulo: string;
  orden: number;
  file: string;
  fileType: string;

  deserialize(input: any): BannerModel {
    Object.assign(this, input);
    return this;
  }
}
