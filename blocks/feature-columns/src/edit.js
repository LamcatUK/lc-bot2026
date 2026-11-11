import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, TextareaControl, SelectControl, ToggleControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RepeaterField from '../../_shared/RepeaterField';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { brushTop, spaceTop, spaceBottom, title, intro, numbered, items, surface } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );
	const spaceOptions = [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ];

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Feature Columns" textDomain="lc-bot2026">
			<TextControl label={ __( 'Heading', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<TextareaControl label={ __( 'Intro (optional)', 'lc-bot2026' ) } value={ intro } onChange={ ( v ) => setAttributes( { intro: v } ) } />
			<ToggleControl label={ __( 'Number the points', 'lc-bot2026' ) } help={ __( 'Use for steps that happen in order.', 'lc-bot2026' ) } checked={ !! numbered } onChange={ ( v ) => setAttributes( { numbered: v } ) } />
			<RepeaterField
				label={ __( 'Points', 'lc-bot2026' ) }
				value={ items }
				onChange={ ( v ) => setAttributes( { items: v } ) }
				layout="column"
				fields={ [
					{ name: 'title', label: __( 'Title', 'lc-bot2026' ), type: 'text' },
					{ name: 'text', label: __( 'Text', 'lc-bot2026' ), type: 'textarea' },
					{ name: 'linkText', label: __( 'Link text (optional)', 'lc-bot2026' ), type: 'text' },
					{ name: 'linkUrl', label: __( 'Link URL (optional)', 'lc-bot2026' ), type: 'text' },
				] }
				emptyRow={ { title: '', text: '', linkText: '', linkUrl: '' } }
			/>
			<SelectControl label={ __( 'Surface', 'lc-bot2026' ) } value={ surface } options={ [ { value: 'surface', label: 'Page (light)' }, { value: 'tint', label: 'Tint' }, { value: 'soft', label: 'Soft accent' }, { value: 'brand', label: 'Brand (dark)' } ] } onChange={ ( v ) => setAttributes( { surface: v } ) } />
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space above', 'lc-bot2026' ) } value={ spaceTop || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceTop: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space below', 'lc-bot2026' ) } value={ spaceBottom || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceBottom: v } ) } /></div>
			</div>
			<ToggleControl label={ __( 'Brush edge at the top', 'lc-bot2026' ) } checked={ !! brushTop } onChange={ ( v ) => setAttributes( { brushTop: v } ) } />
		</EditorBlockShell>
	);
}
