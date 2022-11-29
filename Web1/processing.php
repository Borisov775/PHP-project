<?php
session_start();
date_default_timezone_set('Europe/Moscow');
$start = microtime(true);
$isValid = true;
$xStr = $_REQUEST['x'];
$yStr = $_REQUEST['y'];
$rStr = $_REQUEST['r'];
$x = $xStr;
$y = $yStr;
$r = $rStr;
$out = "";
$now = date("H:i:s");


$response = "";
$maximum = 10;
if (!isset($_SESSION['data'])) {
    $_SESSION['data'] = array();
}
if (isset($_REQUEST['x'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (!is_numeric($x) || !is_numeric($y) || !is_numeric($r))
            $isValid = false;
        if (strlen($y) > $maximum) {
            $y = substr($y, 0, $maximum);
            $yStr = substr($yStr, 0, $maximum);
        }
        if (strlen($x) > $maximum) {
            $x = substr($x, 0, $maximum);
            $xStr = substr($xStr, 0, $maximum);
        }
        if (strlen($r) > $maximum) {
            $r = substr($r, 0, $maximum);
            $rStr = substr($rStr, 0, $maximum);
        }

        if ($x < -3 || $x > 5)
            $isValid = false;
        if ($r < 1 || $r > 5)
            $isValid = false;
        if ($y < -5 || $y > 3)
            $isValid = false;

        if (!$isValid) {
            header("Status: 400 Bad Request", true, 400);
            exit;
        }
        if ((($x >= 0) && ($y >= 0) && ($y <= $r / 2)) ||
            (($x >= 0) && ($y <= 0) && (sqrt(pow($x, 2) + pow($y*2, 2)) <= $r)) ||
            (($x <= 0) && ($y <= 0) && (pow($x , 2) + pow($y, 2) <= pow($r / 2, 2)))) {
            $out = "True";
        } else {
            $out = "False";
        }
        $calc_time = microtime(true) - $start;
        $answer = array($xStr, $yStr, $rStr, $out, $now, number_format($calc_time, 10, ".", "") . " sec");
        array_push($_SESSION['data'], $answer);
    }
}
$result = "";
foreach ($_SESSION['data'] as $resp) {
    $jsonData = '{' .
        "\"xval\":\"$resp[0]\"," .
        "\"yval\":\"$resp[1]\"," .
        "\"rval\":\"$resp[2]\"," .
        "\"out\": \"$resp[3]\"," .
        "\"sendingTime\":\"$resp[4]\"," .
        "\"totalProcessingTime\":\"$resp[5]\"" .
        "}";
    $result = $result . $jsonData . ',';
}
$result = substr($result, 0, -1);
echo '{' . "\"response\":[" . $result . ']}';
?>