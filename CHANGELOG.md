# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

*

### Changed

*

### Fixed

* Set initial `size`, `width` and `height` on configurator bind so that the correct initial dimensions can be applied - [ripe-white/#954](https://github.com/ripe-tech/ripe-white/issues/954)

## [0.20.1] - 2022-01-18

### Changed

* Bumped dependency versions

## [0.20.0] - 2022-01-12

### Changed

* Only emit `load:images` event  in `initials-images` if the image loaded is up to date with the frame - [ripe-white/#948](https://github.com/ripe-tech/ripe-white/issues/948)
* Bumped dependency versions

## [0.19.0] - 2022-01-12

### Added

* Support for width, height and frame in `initials-images` - [ripe-white/#948](https://github.com/ripe-tech/ripe-white/issues/948)

### Changed

* Bumped RIPE SDK

## [0.18.0] - 2021-11-26

### Changed

* Support rectangular thumbnails - [ripe-white/#943](https://github.com/ripe-tech/ripe-white/issues/943)
* Bumped package versions (including `ripe-sdk`)

## [0.17.0] - 2021-11-26

### Added

* Support for gender, scale and size coming from URL params - [#927](https://github.com/ripe-tech/ripe-commons-pluginus/pull/271)

## [0.16.2] - 2021-11-24

### Fixed

* Resolution not being properly set by SDK options or URL params

## [0.16.1] - 2021-11-21

### Changed

* Bumped dependencies

## [0.16.0] - 2021-11-05

### Changed

* Bumped dependencies

## [0.15.1] - 2021-09-27

### Fixed

* Configurator `useMasks` calculation to comply with [ripe-sdk/#313](https://github.com/ripe-tech/ripe-sdk/pull/313)

## [0.15.0] - 2021-09-14

### Changed

* Update RIPE SDK to `2.7.0`

## [0.14.0] - 2021-09-01

### Added

* As default, extracts the reference size and available scales from the 3DB's `spec.json`
* It's now possible to configure the size modal's select button label both through props and `open_size` event options
* Configurable labels for personalization/size buttons and modals through the store

## [0.13.3] - 2021-08-26

### Changed

* Bumped `ripe-sdk` package

## [0.13.2] - 2021-08-26

### Added

* Ability to override the available and reference scale of the reference size plugin

### Changed

* Bumped packages

## [0.13.1] - 2021-08-11

### Added

* Support for `viewport::partial` in generic personalization

## [0.13.0] - 2021-08-09

### Changes

* Bumped packages

## [0.12.3] - 2021-07-26

### Fixed

* Set the correct size when initiating the configurator, avoiding visual glitches

## [0.12.2] - 2021-07-18

### Fixed

* Issue related with resize configurator operations during loading, which would not disable the initial loader

## [0.12.1] - 2021-07-01

### Added

* Optional click for initials images that opens the image in a new tab

## [0.12.0] - 2021-06-22

### Added

* Bumped packages

### Fixed

* Added missing "u" to supported characters

## [0.11.3] - 2021-06-14

### Changed

* Update the RIPE SDK to version `2.0.1`

## [0.11.2] - 2021-05-18

### Fixed

* Missing `sizeText` in store

## [0.11.1] - 2021-05-18

### Fixed

* Size selection failing when gender is required

## [0.11.0] - 2021-05-14

### Added

* Set default size on model config

### Fixed

* Avoid calling 3DB logic methods with undefined `ctx`

## [0.10.6] - 2021-05-04

### Added

* Use ripe-sdk 1.25.7

## [0.10.5] - 2021-04-29

### Fixed

* Allow entering with `variant`

## [0.10.4] - 2021-04-20

### Added

* Better handling of plugin loading errors

## [0.10.3] - 2021-04-13

### Fixed

* Issue related with wrong personalization image size

## [0.10.2] - 2021-04-13

### Added

* Retina support for swatches

## [0.10.1] - 2021-03-02

### Fixed

* Issue with incompatible size ranges

## [0.10.0] - 2021-03-02

### Added

* Changelog document
* Support for the select selected option
