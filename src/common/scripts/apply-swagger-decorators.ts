/**
 * SCRIPT PARA APLICAR DECORATORS DE ERRO DO SWAGGER
 *
 * Este script pode ser usado para aplicar automaticamente os decorators
 * de erro do Swagger em todos os controllers do projeto.
 *
 * USO:
 * 1. Execute: npx ts-node src/common/scripts/apply-swagger-decorators.ts
 * 2. Ou importe e use as funções em outros scripts
 */

import * as fs from 'fs';
import * as path from 'path';

interface ControllerMethod {
  name: string;
  decorators: string[];
  httpMethod: string;
  lineNumber: number;
}

interface ControllerInfo {
  filePath: string;
  className: string;
  methods: ControllerMethod[];
}

/**
 * Encontra todos os controllers no projeto
 */
export function findControllers(): string[] {
  const controllers: string[] = [];
  const srcDir = path.join(__dirname, '../../..');

  function searchDirectory(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (
        stat.isDirectory() &&
        !file.startsWith('.') &&
        file !== 'node_modules'
      ) {
        searchDirectory(filePath);
      } else if (file.endsWith('.controller.ts')) {
        controllers.push(filePath);
      }
    }
  }

  searchDirectory(srcDir);
  return controllers;
}

/**
 * Analisa um controller e extrai informações dos métodos
 */
export function analyzeController(filePath: string): ControllerInfo | null {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const classNameMatch = content.match(/export class (\w+Controller)/);
  if (!classNameMatch) return null;

  const className = classNameMatch[1];
  const methods: ControllerMethod[] = [];

  let currentMethod: Partial<ControllerMethod> | null = null;
  let braceCount = 0;
  let inMethod = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detecta início de método
    const methodMatch = line.match(/async\s+(\w+)\s*\(/);
    if (methodMatch && !inMethod) {
      currentMethod = {
        name: methodMatch[1],
        decorators: [],
        httpMethod: '',
        lineNumber: i + 1,
      };
      inMethod = true;
      continue;
    }

    if (inMethod && currentMethod) {
      // Detecta decorators HTTP
      const httpDecoratorMatch = line.match(
        /@(Get|Post|Put|Patch|Delete|Head|Options)\s*\(/,
      );
      if (httpDecoratorMatch) {
        currentMethod.httpMethod = httpDecoratorMatch[1].toLowerCase();
        currentMethod.decorators?.push(line.trim());
      } else if (line.includes('@')) {
        currentMethod.decorators?.push(line.trim());
      }

      // Detecta fim do método
      if (line.includes('{')) braceCount++;
      if (line.includes('}')) braceCount--;

      if (braceCount === 0 && inMethod) {
        methods.push(currentMethod as ControllerMethod);
        currentMethod = null;
        inMethod = false;
      }
    }
  }

  return {
    filePath,
    className,
    methods,
  };
}

/**
 * Gera o decorator apropriado baseado no método HTTP
 */
export function getErrorDecorator(httpMethod: string): string {
  switch (httpMethod.toLowerCase()) {
    case 'post':
      return '@ApiCreateErrorResponses()';
    case 'put':
    case 'patch':
      return '@ApiUpdateErrorResponses()';
    case 'delete':
      return '@ApiDeleteErrorResponses()';
    case 'get':
    default:
      return '@ApiFindErrorResponses()';
  }
}

/**
 * Aplica os decorators de erro em um controller
 */
export function applyErrorDecorators(controllerInfo: ControllerInfo): string {
  const content = fs.readFileSync(controllerInfo.filePath, 'utf-8');
  const lines = content.split('\n');

  // Adiciona import se não existir
  let importAdded = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("from '@nestjs/swagger'")) {
      if (!lines[i].includes('ApiCreateErrorResponses')) {
        lines[i] = lines[i].replace(
          "} from '@nestjs/swagger';",
          ", ApiCreateErrorResponses, ApiUpdateErrorResponses, ApiFindErrorResponses, ApiDeleteErrorResponses } from '@nestjs/swagger';",
        );
        importAdded = true;
      }
      break;
    }
  }

  if (!importAdded) {
    // Adiciona import do common/decorators
    const importLine =
      "import { ApiCreateErrorResponses, ApiUpdateErrorResponses, ApiFindErrorResponses, ApiDeleteErrorResponses } from '@/common/decorators';";
    lines.splice(1, 0, importLine);
  }

  // Aplica decorators nos métodos
  for (const method of controllerInfo.methods) {
    if (method.httpMethod) {
      const errorDecorator = getErrorDecorator(method.httpMethod);
      const methodLine = method.lineNumber - 1;

      // Verifica se já tem o decorator
      let hasErrorDecorator = false;
      for (let i = methodLine - 1; i >= 0; i--) {
        if (lines[i].includes('@Api') && lines[i].includes('ErrorResponses')) {
          hasErrorDecorator = true;
          break;
        }
        if (lines[i].trim() === '' || lines[i].includes('async')) {
          break;
        }
      }

      if (!hasErrorDecorator) {
        // Adiciona o decorator antes do método
        lines.splice(methodLine, 0, `  ${errorDecorator}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Processa todos os controllers do projeto
 */
export function processAllControllers(): void {
  const controllers = findControllers();
  console.log(`Encontrados ${controllers.length} controllers:`);

  for (const controllerPath of controllers) {
    console.log(`\nProcessando: ${controllerPath}`);

    const controllerInfo = analyzeController(controllerPath);
    if (!controllerInfo) {
      console.log('  ❌ Não é um controller válido');
      continue;
    }

    console.log(`  📁 Classe: ${controllerInfo.className}`);
    console.log(`  🔧 Métodos encontrados: ${controllerInfo.methods.length}`);

    for (const method of controllerInfo.methods) {
      if (method.httpMethod) {
        console.log(
          `    - ${method.name} (${method.httpMethod.toUpperCase()})`,
        );
      }
    }

    // Aplica os decorators
    const updatedContent = applyErrorDecorators(controllerInfo);

    // Salva o arquivo atualizado
    fs.writeFileSync(controllerPath, updatedContent);
    console.log('  ✅ Decorators aplicados com sucesso');
  }

  console.log('\n🎉 Processamento concluído!');
}

// Executa o script se chamado diretamente
if (require.main === module) {
  processAllControllers();
}
