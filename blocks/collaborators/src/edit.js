import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, TextareaControl, SelectControl, ToggleControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { brushTop, spaceTop, spaceBottom, title, intro, surface } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );
	const spaceOptions = [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ];

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Collaborators" textDomain="lc-bot2026">
			<p>{ __( 'The collaborators shown here are managed in Site-Wide Settings, under the Collaborators tab.', 'lc-bot2026' ) }</p>
			<TextControl label={ __( 'Heading', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<TextareaControl label={ __( 'Intro (optional)', 'lc-bot2026' ) } value={ intro } onChange={ ( v ) => setAttributes( { intro: v } ) } />
			<SelectControl label={ __( 'Surface', 'lc-bot2026' ) } value={ surface } options={ [ { value: 'surface', label: 'Page (light)' }, { value: 'tint', label: 'Tint' }, { value: 'soft', label: 'Soft accent' }, { value: 'brand', label: 'Brand (dark)' } ] } onChange={ ( v ) => setAttributes( { surface: v } ) } />
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space above', 'lc-bot2026' ) } value={ spaceTop || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceTop: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space below', 'lc-bot2026' ) } value={ spaceBottom || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceBottom: v } ) } /></div>
			</div>
			<ToggleControl label={ __( 'Brush edge at the top', 'lc-bot2026' ) } help={ __( 'Paints this block over the bottom of the one above.', 'lc-bot2026' ) } checked={ !! brushTop } onChange={ ( v ) => setAttributes( { brushTop: v } ) } />
		</EditorBlockShell>
	);
}
