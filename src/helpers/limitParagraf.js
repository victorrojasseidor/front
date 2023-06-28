// Componente de párrafo limitado con CSS

const LimitedParagraph = ({ text, limit }) => {
    const displayText = text.length > limit ? text.slice(0, limit) + '...' : text;
  
    return (
      <p className="limited-paragraph">
        {displayText}
      </p>
    );
  };
  
  export default LimitedParagraph;
  