// HU14: avatar del usuario (avatar prediseñado de Capy o foto subida)
import './UserAvatar.css';
import capyImage from '../../assets/desktop/svg/Capybara.svg';

// Avatares prediseñados: el capibara sobre distintos colores de la marca
export const PRESET_AVATARS = [
    { id: 'capy:#2D18BF', color: '#2D18BF', label: 'Blue Capy' },
    { id: 'capy:#A8F25D', color: '#A8F25D', label: 'Green Capy' },
    { id: 'capy:#F2622E', color: '#F2622E', label: 'Orange Capy' },
    { id: 'capy:#CCFC56', color: '#CCFC56', label: 'Lime Capy' },
];

interface UserAvatarProps {
    avatar: string,          // "" = usa la imagen por defecto
    fallbackSrc: string,     // imagen que se muestra si no hay avatar
    className?: string,
    alt?: string,
    onClick?: () => void,
    size?: number | string
}

export const UserAvatar = ({ avatar, fallbackSrc, className, alt = 'Avatar', onClick, size }: UserAvatarProps) => {
    const sizeStyle = size !== undefined ? { width: size, height: size } : {};

    if (avatar.startsWith('data:image/')) {
        return <img src={avatar} alt={alt} className={`photoAvatar ${className ?? ''}`} onClick={onClick} style={sizeStyle} />;
    }

    if (avatar.startsWith('capy:')) {
        const color = avatar.slice(5);
        return (
            <span role="img" aria-label={alt} className={`capyAvatar ${className ?? ''}`} onClick={onClick}
                style={{ ...sizeStyle, backgroundColor: color }}>
                <img src={capyImage} alt="" />
            </span>
        );
    }

    return <img src={fallbackSrc} alt={alt} className={className} onClick={onClick} style={sizeStyle} />;
};

// HU14 (CA2, CA3): valida la foto (JPG/PNG, máximo 2 MB) y la reduce a 256 px para guardarla
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export const prepareAvatarFile = (file: File): Promise<string> => new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > MAX_AVATAR_BYTES) {
        reject({ code: 'avatar/invalid-file' });
        return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject({ code: 'avatar/invalid-file' });
    reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject({ code: 'avatar/invalid-file' });
        img.onload = () => {
            const size = 256;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (!ctx) { reject({ code: 'avatar/invalid-file' }); return; }
            // Recorte cuadrado centrado
            const side = Math.min(img.width, img.height);
            ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
});
