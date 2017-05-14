<?php
require_once __DIR__.'/vendor/autoload.php';

date_default_timezone_set('Asia/Bangkok');

$app = new Silex\Application();
$app['debug'] = true;
ob_start("ob_gzhandler");

require_once "database.php";

$app->before(function (Symfony\Component\HttpFoundation\Request $request) {
	if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
		$data = json_decode($request->getContent(), true);
		$request->request->replace(is_array($data) ? $data : array());
	}
});

use Symfony\Component\HttpFoundation\Response;

$app->error(function(Symfony\Component\HttpKernel\Exception\HttpExceptionInterface $e){
    $res = new Response($e->getMessage());
    $res->headers->replace($e->getHeaders());
    $res->setStatusCode($e->getStatusCode());
    return $res;
});

use Symfony\Component\Debug\ErrorHandler;
use Symfony\Component\HttpKernel\Debug\ExceptionHandler;

ErrorHandler::register();
ExceptionHandler::register();

$app->register(new Silex\Provider\SessionServiceProvider());

$app->mount('/', new Regis\Web\RegisterAPI('\Regis\Model\Register'));

$app->run();