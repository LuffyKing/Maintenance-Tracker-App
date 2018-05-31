import YAML from 'yamljs';


const swaggerDocument = YAML.load('./server/swagger.yaml');
export default swaggerDocument;
