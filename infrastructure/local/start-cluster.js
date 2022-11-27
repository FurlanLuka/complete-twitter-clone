import util from 'util';
import chalk from 'chalk';
import { program, CommanderError } from 'commander';
import clear from 'clear';
import { exec } from 'child_process';

const execAsync = util.promisify(exec);

async function checkRequirements(debugEnabled) {
  try {
    await execAsync('minikube');
  } catch {
    throw new Error('Minikube missing');
  }

  try {
    await execAsync('eval $(minikube -u minikube docker-env)');
    await execAsync('docker info');
  } catch {
    throw new Error('Docker missing or not running');
  }

  try {
    await execAsync('helm');
  } catch {
    throw new Error('Helm missing');
  }

  try {
    await execAsync('kubectl');
  } catch {
    throw new Error('Kubectl missing');
  }
}

async function setupCluster(debugEnabled) {
  try {
    console.log('Deleting old cluster...');
    await execAsync('minikube delete');
    console.log('Cluster deleted ✅');
    console.log('Setting up fresh cluster...');
    await execAsync('minikube start');
    console.log('Cluster created ✅');
    console.log('Setting up deployments...')
    await execAsync('helm repo add datadog https://helm.datadoghq.com');
    await execAsync('helm repo add bitnami https://charts.bitnami.com/bitnami');
    await execAsync('helm repo update');
    console.log('Starting RabbitMQ...')
    await execAsync(
      `helm install rabbitmq -f helm/rmq-values.yml bitnami/rabbitmq`,
    );
    console.log('RabbitMQ Started ✅');
    console.log('Starting PostgresSQL...');
    await execAsync(
      `helm install postgresql -f helm/pg-values.yml bitnami/postgresql`,
    );
    console.log('PostgreSQL Started ✅');
    console.log('Starting Redis');
    await execAsync(
      `helm install redis -f helm/redis-values.yml bitnami/redis`,
    );
    console.log('Redis Started ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Issue while setting up cluster, is your docker running?');
  }
}

async function getMicroservices(debugEnabled) {
  try {
    const { stdout } = await execAsync('ls ../../application/apps');

    const microservices = stdout
      .split(/\r?\n/)
      .filter((service) => service.length > 0);

    if (debugEnabled) {
      console.log('Microservices ', microservices);
    }

    return microservices;
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while listing microservices');
  }
}

async function buildMicroservices(microservices, debugEnabled) {
  try {
    const buildCommands = [];

    for (let i = 0; i < microservices.length; i++) {
      const microservice = microservices[i];

      buildCommands.push(
        `cd ../../application && DOCKER_SCAN_SUGGEST=false docker build -f apps/${microservice}/Dockerfile.local -t ${microservice}:latest . && cd ../infrastructure/local`,
      );
    }

    console.log(
      `Building ${
        microservices.length === 1 ? 'microservice' : 'microservices'
      }...(this might take a while)`,
    );

    if (debugEnabled) {
      console.log(
        `eval $(minikube docker-env) ${buildCommands
          .map((command) => `&& ${command}`)
          .join(' ')}`,
      );
    }

    await execAsync(
      `eval $(minikube docker-env) ${buildCommands
        .map((command) => `&& ${command}`)
        .join(' ')}`,
    );

    console.log('Build successful ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(JSON.stringify(error, null, 2));
    }
    throw new Error('Error while building microservices');
  }
}

async function deployMicroservices(microservices, debugEnabled) {
  try {
    for (let i = 0; i < microservices.length; i++) {
      const microservice = microservices[i];

      console.log(`Deploying ${microservice}...`);

      await execAsync(
        `helm upgrade --install ${microservice} helm/microservice --set tag=latest --set image=${microservice} --set local=true --set environment=local --set service=${microservice}`,
      );
      console.log(`${microservice} deployed ✅`);
    }
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while deploying microservices');
  }
}

async function cleanup(debugEnabled) {
  try {
    console.log('Cleaning up...');
    await execAsync('eval $(minikube -u minikube docker-env)');
    console.log('Cleaned up ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Issue while setting up docker, is your docker running?');
  }
}


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

program
  .command('install')
  .alias('i')
  .option('-d, --debug')
  .action(async ({ debug = true }) => {
    clear();

    console.log(
      chalk.inverse.bold('Starting local microservice deployment...'),
    );


    try {
      await checkRequirements(debug);
      await setupCluster(debug);
      const microservices = await getMicroservices(debug);
      await buildMicroservices(microservices, debug);
      await deployMicroservices(microservices, debug);
    } catch (error) {
      console.log(chalk.red.bold(error.message));
    }
  });


program.parse();