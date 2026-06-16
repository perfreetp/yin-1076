import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface SymptomTagProps {
  symptom: string;
  selected?: boolean;
  onClick?: (symptom: string) => void;
  severity?: 'mild' | 'moderate' | 'severe';
}

const severityColors: Record<string, string> = {
  mild: '#52C41A',
  moderate: '#FAAD14',
  severe: '#FF4D4F'
};

const SymptomTag: React.FC<SymptomTagProps> = ({ 
  symptom, 
  selected = false, 
  onClick, 
  severity = 'mild' 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(symptom);
    }
  };

  return (
    <View 
      className={classnames(
        styles.symptomTag,
        selected && styles.selected
      )}
      style={{ 
        borderColor: selected ? severityColors[severity] : undefined,
        background: selected ? `${severityColors[severity]}15` : undefined
      }}
      onClick={handleClick}
    >
      <Text 
        className={styles.symptomText}
        style={{ color: selected ? severityColors[severity] : undefined }}
      >
        {symptom}
      </Text>
      {selected && (
        <View className={styles.checkIcon} style={{ background: severityColors[severity] }}>
          ✓
        </View>
      )}
    </View>
  );
};

export default SymptomTag;
