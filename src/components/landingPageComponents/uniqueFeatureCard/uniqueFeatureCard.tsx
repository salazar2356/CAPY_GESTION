import './uniqueFeatureCard.css'

interface UniqueFeatureCardProps {
  title: string;
  text: string;
  textColor: string;
  backgroundImage: string;
}

export const UniqueFeatureCard = ({
  title,
  text,
  textColor,
  backgroundImage,
}: UniqueFeatureCardProps) => {
  return (
    <>
      <div
        className="uniqueFeatureCardContainer"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h3 style={{ color: textColor }}>{title}</h3>

        <p style={{ color: textColor }}>{text}</p>
      </div>
    </>
  );
};
