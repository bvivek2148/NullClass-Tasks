#!/usr/bin/env node

/**
 * Translation Checker Script
 * 
 * This script validates translation files to ensure:
 * 1. All languages have the same keys
 * 2. No missing translations
 * 3. Proper JSON format
 * 4. No empty values
 * 5. Consistent interpolation variables
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../public/locales');
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
const BASE_LANGUAGE = 'en';

class TranslationChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalKeys: 0,
      translatedKeys: {},
      missingKeys: {},
      emptyValues: {},
      interpolationMismatches: {}
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  loadTranslations(language) {
    const filePath = path.join(LOCALES_DIR, language, 'common.json');
    
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Translation file not found: ${filePath}`);
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      this.errors.push(`Failed to load ${language} translations: ${error.message}`);
      return null;
    }
  }

  flattenObject(obj, prefix = '') {
    const flattened = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          Object.assign(flattened, this.flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  }

  extractInterpolationVars(text) {
    if (typeof text !== 'string') return [];
    
    const matches = text.match(/\{\{([^}]+)\}\}/g);
    return matches ? matches.map(match => match.slice(2, -2).trim()) : [];
  }

  checkTranslations() {
    this.log('Starting translation validation...', 'info');
    
    // Load all translations
    const translations = {};
    const flatTranslations = {};
    
    for (const lang of SUPPORTED_LANGUAGES) {
      this.log(`Loading ${lang} translations...`, 'info');
      translations[lang] = this.loadTranslations(lang);
      
      if (translations[lang]) {
        flatTranslations[lang] = this.flattenObject(translations[lang]);
        this.stats.translatedKeys[lang] = Object.keys(flatTranslations[lang]).length;
      } else {
        this.stats.translatedKeys[lang] = 0;
      }
    }

    // Use base language as reference
    const baseTranslations = flatTranslations[BASE_LANGUAGE];
    if (!baseTranslations) {
      this.errors.push(`Base language (${BASE_LANGUAGE}) translations not found`);
      return;
    }

    const baseKeys = Object.keys(baseTranslations);
    this.stats.totalKeys = baseKeys.length;
    
    this.log(`Found ${this.stats.totalKeys} keys in base language (${BASE_LANGUAGE})`, 'info');

    // Check each language against base
    for (const lang of SUPPORTED_LANGUAGES) {
      if (lang === BASE_LANGUAGE) continue;
      
      this.log(`Checking ${lang} translations...`, 'info');
      
      const langTranslations = flatTranslations[lang];
      if (!langTranslations) continue;

      const langKeys = Object.keys(langTranslations);
      this.stats.missingKeys[lang] = [];
      this.stats.emptyValues[lang] = [];
      this.stats.interpolationMismatches[lang] = [];

      // Check for missing keys
      for (const key of baseKeys) {
        if (!langTranslations.hasOwnProperty(key)) {
          this.stats.missingKeys[lang].push(key);
        } else {
          // Check for empty values
          if (!langTranslations[key] || langTranslations[key].trim() === '') {
            this.stats.emptyValues[lang].push(key);
          }
          
          // Check interpolation variables
          const baseVars = this.extractInterpolationVars(baseTranslations[key]);
          const langVars = this.extractInterpolationVars(langTranslations[key]);
          
          const missingVars = baseVars.filter(v => !langVars.includes(v));
          const extraVars = langVars.filter(v => !baseVars.includes(v));
          
          if (missingVars.length > 0 || extraVars.length > 0) {
            this.stats.interpolationMismatches[lang].push({
              key,
              missing: missingVars,
              extra: extraVars
            });
          }
        }
      }

      // Check for extra keys (keys in translation but not in base)
      const extraKeys = langKeys.filter(key => !baseKeys.includes(key));
      if (extraKeys.length > 0) {
        this.warnings.push(`${lang} has ${extraKeys.length} extra keys: ${extraKeys.slice(0, 5).join(', ')}${extraKeys.length > 5 ? '...' : ''}`);
      }
    }
  }

  generateReport() {
    this.log('\n📊 Translation Report', 'info');
    this.log('='.repeat(50), 'info');
    
    // Summary
    console.log('\n📈 Summary:');
    console.log(`Total keys in base language (${BASE_LANGUAGE}): ${this.stats.totalKeys}`);
    
    for (const lang of SUPPORTED_LANGUAGES) {
      const translated = this.stats.translatedKeys[lang] || 0;
      const coverage = this.stats.totalKeys > 0 ? ((translated / this.stats.totalKeys) * 100).toFixed(1) : '0.0';
      console.log(`${lang.toUpperCase()}: ${translated}/${this.stats.totalKeys} keys (${coverage}% coverage)`);
    }

    // Missing keys
    console.log('\n🔍 Missing Keys:');
    let hasMissingKeys = false;
    for (const lang of SUPPORTED_LANGUAGES) {
      if (lang === BASE_LANGUAGE) continue;
      
      const missing = this.stats.missingKeys[lang] || [];
      if (missing.length > 0) {
        hasMissingKeys = true;
        console.log(`${lang.toUpperCase()}: ${missing.length} missing keys`);
        missing.slice(0, 10).forEach(key => console.log(`  - ${key}`));
        if (missing.length > 10) {
          console.log(`  ... and ${missing.length - 10} more`);
        }
      }
    }
    if (!hasMissingKeys) {
      console.log('✅ No missing keys found!');
    }

    // Empty values
    console.log('\n📝 Empty Values:');
    let hasEmptyValues = false;
    for (const lang of SUPPORTED_LANGUAGES) {
      const empty = this.stats.emptyValues[lang] || [];
      if (empty.length > 0) {
        hasEmptyValues = true;
        console.log(`${lang.toUpperCase()}: ${empty.length} empty values`);
        empty.slice(0, 5).forEach(key => console.log(`  - ${key}`));
        if (empty.length > 5) {
          console.log(`  ... and ${empty.length - 5} more`);
        }
      }
    }
    if (!hasEmptyValues) {
      console.log('✅ No empty values found!');
    }

    // Interpolation mismatches
    console.log('\n🔧 Interpolation Mismatches:');
    let hasMismatches = false;
    for (const lang of SUPPORTED_LANGUAGES) {
      if (lang === BASE_LANGUAGE) continue;
      
      const mismatches = this.stats.interpolationMismatches[lang] || [];
      if (mismatches.length > 0) {
        hasMismatches = true;
        console.log(`${lang.toUpperCase()}: ${mismatches.length} mismatches`);
        mismatches.slice(0, 3).forEach(mismatch => {
          console.log(`  - ${mismatch.key}`);
          if (mismatch.missing.length > 0) {
            console.log(`    Missing: ${mismatch.missing.join(', ')}`);
          }
          if (mismatch.extra.length > 0) {
            console.log(`    Extra: ${mismatch.extra.join(', ')}`);
          }
        });
        if (mismatches.length > 3) {
          console.log(`  ... and ${mismatches.length - 3} more`);
        }
      }
    }
    if (!hasMismatches) {
      console.log('✅ No interpolation mismatches found!');
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    // Errors
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    // Final status
    console.log('\n' + '='.repeat(50));
    const totalMissing = Object.values(this.stats.missingKeys).reduce((sum, arr) => sum + arr.length, 0);
    const totalEmpty = Object.values(this.stats.emptyValues).reduce((sum, arr) => sum + arr.length, 0);
    const totalMismatches = Object.values(this.stats.interpolationMismatches).reduce((sum, arr) => sum + arr.length, 0);
    
    if (this.errors.length === 0 && totalMissing === 0 && totalEmpty === 0 && totalMismatches === 0) {
      this.log('🎉 All translations are valid and complete!', 'success');
      return 0;
    } else {
      this.log(`❌ Found issues: ${this.errors.length} errors, ${totalMissing} missing keys, ${totalEmpty} empty values, ${totalMismatches} interpolation mismatches`, 'error');
      return 1;
    }
  }

  run() {
    try {
      this.checkTranslations();
      return this.generateReport();
    } catch (error) {
      this.log(`Fatal error: ${error.message}`, 'error');
      console.error(error.stack);
      return 1;
    }
  }
}

// Run the checker
if (require.main === module) {
  const checker = new TranslationChecker();
  const exitCode = checker.run();
  process.exit(exitCode);
}

module.exports = TranslationChecker;
